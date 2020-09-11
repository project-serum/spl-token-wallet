import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from '../utils/wallet';
import { decodeMessage } from '../utils/transactions';
import { useConnection, useSolanaExplorerUrlSuffix } from '../utils/connection';
import { Typography, Divider } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { makeStyles } from '@material-ui/core/styles';
import assert from 'assert';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import CancelOrder from '../components/instructions/CancelOrder';
import NewOrder from '../components/instructions/NewOrder';
import SettleFunds from '../components/instructions/SettleFunds';
import UnknownInstruction from '../components/instructions/UnknownInstruction';
import MatchOrder from '../components/instructions/MatchOrder';

export default function PopupPage({ opener }) {
  const wallet = useWallet();

  const origin = useMemo(() => {
    let params = new URLSearchParams(window.location.hash.slice(1));
    return params.get('origin');
  }, []);
  const postMessage = useCallback(
    (message) => {
      opener.postMessage({ jsonrpc: '2.0', ...message }, origin);
    },
    [opener, origin],
  );

  const [connectedAccount, setConnectedAccount] = useState(null);
  const hasConnectedAccount = !!connectedAccount;
  const [requests, setRequests] = useState([]);

  // Send a disconnect event if this window is closed, this component is
  // unmounted, or setConnectedAccount(null) is called.
  useEffect(() => {
    if (hasConnectedAccount) {
      function unloadHandler() {
        postMessage({ method: 'disconnected' });
      }
      window.addEventListener('beforeunload', unloadHandler);
      return () => {
        unloadHandler();
        window.removeEventListener('beforeunload', unloadHandler);
      };
    }
  }, [hasConnectedAccount, postMessage]);

  // Disconnect if the user switches to a different wallet.
  useEffect(() => {
    if (
      connectedAccount &&
      !connectedAccount.publicKey.equals(wallet.publicKey)
    ) {
      setConnectedAccount(null);
    }
  }, [connectedAccount, wallet]);

  // Push requests from the parent window into a queue.
  useEffect(() => {
    function messageHandler(e) {
      if (e.origin === origin && e.source === window.opener) {
        if (e.data.method !== 'signTransaction') {
          postMessage({ error: 'Unsupported method', id: e.data.id });
        }
        setRequests((requests) => [...requests, e.data]);
      }
    }
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [origin, postMessage]);

  if (
    !connectedAccount ||
    !connectedAccount.publicKey.equals(wallet.publicKey)
  ) {
    // Approve the parent page to connect to this wallet.
    function connect() {
      setConnectedAccount(wallet.account);
      postMessage({
        method: 'connected',
        params: { publicKey: wallet.publicKey.toBase58() },
      });
      focusParent();
    }

    return <ApproveConnectionForm origin={origin} onApprove={connect} />;
  }

  if (requests.length > 0) {
    const request = requests[0];
    assert(request.method === 'signTransaction');
    const message = bs58.decode(request.params.message);

    function sendSignature() {
      setRequests((requests) => requests.slice(1));
      postMessage({
        result: {
          signature: bs58.encode(
            nacl.sign.detached(message, wallet.account.secretKey),
          ),
          publicKey: wallet.publicKey.toBase58(),
        },
        id: request.id,
      });
      if (requests.length === 1) {
        focusParent();
      }
    }

    function sendReject() {
      setRequests((requests) => requests.slice(1));
      postMessage({
        error: 'Transaction cancelled',
        id: request.id,
      });
      if (requests.length === 1) {
        focusParent();
      }
    }

    return (
      <ApproveSignatureForm
        origin={origin}
        message={message}
        onApprove={sendSignature}
        onReject={sendReject}
      />
    );
  }

  return (
    <Typography>Please keep this window open in the background.</Typography>
  );
}

/**
 * Switch focus to the parent window. This requires that the parent runs
 * `window.name = 'parent'` before opening the popup.
 */
function focusParent() {
  window.open('', 'parent');
}

const useStyles = makeStyles((theme) => ({
  connection: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  transaction: {
    wordBreak: 'break-all',
  },
  actions: {
    justifyContent: 'space-between',
  },
}));

function ApproveConnectionForm({ origin, onApprove }) {
  const wallet = useWallet();
  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h1" gutterBottom>
          Allow this site to access your Solana account?
        </Typography>
        <div className={classes.connection}>
          <Typography>{origin}</Typography>
          <ImportExportIcon fontSize="large" />
          <Typography>{wallet.publicKey.toBase58()}</Typography>
        </div>
        <Typography>Only connect with sites you trust.</Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button onClick={window.close}>Cancel</Button>
        <Button color="primary" onClick={onApprove}>
          Connect
        </Button>
      </CardActions>
    </Card>
  );
}

function ApproveSignatureForm({ origin, message, onApprove, onReject }) {
  const classes = useStyles();
  const explorerUrlSuffix = useSolanaExplorerUrlSuffix();
  const connection = useConnection();
  const wallet = useWallet();

  const [parsing, setParsing] = useState(true);
  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    decodeMessage(connection, wallet, message).then((instructions) => {
      setInstructions(instructions);
      setParsing(false);
    });
  }, [message, connection, wallet]);

  const onOpenAddress = (address) => {
    address &&
      window.open(
        'https://explorer.solana.com/address/' + address + explorerUrlSuffix,
        '_blank',
      );
  };

  const getContent = (instruction) => {
    switch (instruction?.type) {
      case 'cancelOrder':
        return (
          <CancelOrder
            instruction={instruction}
            onOpenAddress={onOpenAddress}
          />
        );
      case 'newOrder':
        return (
          <NewOrder instruction={instruction} onOpenAddress={onOpenAddress} />
        );
      case 'settleFunds':
        return (
          <SettleFunds
            instruction={instruction}
            onOpenAddress={onOpenAddress}
          />
        );
      case 'matchOrders':
        return (
          <MatchOrder instruction={instruction} onOpenAddress={onOpenAddress} />
        );
      default:
        return <UnknownInstruction message={message} />;
    }
  };

  return (
    <Card>
      <CardContent>
        {parsing ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {instructions
                ? `${origin} wants to:`
                : `Unknown transaction data`}
            </Typography>
            {instructions ? (
              instructions.map((instruction) => (
                <Box style={{ marginTop: 20 }}>
                  {getContent(instruction)}
                  <Divider style={{ marginTop: 20 }} />
                </Box>
              ))
            ) : (
              <UnknownInstruction message={message} />
            )}
          </>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        <Button onClick={onReject}>Cancel</Button>
        <Button color="primary" onClick={onApprove}>
          Approve
        </Button>
      </CardActions>
    </Card>
  );
}

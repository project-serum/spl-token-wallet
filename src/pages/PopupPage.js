import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet, useWalletPublicKeys } from '../utils/wallet';
import { decodeMessage } from '../utils/transactions';
import { useConnection, useSolanaExplorerUrlSuffix } from '../utils/connection';
import {
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  SnackbarContent,
} from '@material-ui/core';
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
import NewOrder from '../components/instructions/NewOrder';
import UnknownInstruction from '../components/instructions/UnknownInstruction';
import WarningIcon from '@material-ui/icons/Warning';
import SystemInstruction from '../components/instructions/SystemInstruction';
import DexInstruction from '../components/instructions/DexInstruction';
import TokenInstruction from '../components/instructions/TokenInstruction';
import { useLocalStorageState } from '../utils/utils';

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
  const [autoApprove, setAutoApprove] = useState(false);

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
    function connect(autoApprove) {
      setConnectedAccount(wallet.account);
      postMessage({
        method: 'connected',
        params: { publicKey: wallet.publicKey.toBase58(), autoApprove },
      });
      setAutoApprove(autoApprove);
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
        key={request.id}
        autoApprove={autoApprove}
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
  snackbarRoot: {
    backgroundColor: theme.palette.background.paper,
  },
  warningMessage: {
    margin: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  warningIcon: {
    marginRight: theme.spacing(1),
    fontSize: 24,
  },
  warningTitle: {
    color: theme.palette.warning.light,
    fontWeight: 600,
    fontSize: 16,
    alignItems: 'center',
    display: 'flex',
  },
  warningContainer: {
    marginTop: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function ApproveConnectionForm({ origin, onApprove }) {
  const wallet = useWallet();
  const classes = useStyles();
  const [autoApprove, setAutoApprove] = useState(false);
  let [dismissed, setDismissed] = useLocalStorageState(
    'dismissedAutoApproveWarning',
    false,
  );
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
        <Divider className={classes.divider} />
        <FormControlLabel
          control={
            <Switch
              checked={autoApprove}
              onChange={() => setAutoApprove(!autoApprove)}
              color="primary"
            />
          }
          label={`Automatically approve transactions from ${origin}`}
        />
        {!dismissed && autoApprove && (
          <SnackbarContent
            className={classes.warningContainer}
            message={
              <div>
                <span className={classes.warningTitle}>
                  <WarningIcon className={classes.warningIcon} />
                  Use at your own risk.
                </span>
                <Typography className={classes.warningMessage}>
                  This setting allows sending some transactions on your behalf
                  without requesting your permission for the remainder of this
                  session.
                </Typography>
              </div>
            }
            action={[
              <Button onClick={() => setDismissed('1')}>I understand</Button>,
            ]}
            classes={{ root: classes.snackbarRoot }}
          />
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        <Button onClick={window.close}>Cancel</Button>
        <Button
          color="primary"
          onClick={() => onApprove(autoApprove)}
          disabled={!dismissed && autoApprove}
        >
          Connect
        </Button>
      </CardActions>
    </Card>
  );
}

function isSafeInstruction(publicKeys, owner, instructions) {
  let unsafe = false;
  const states = {
    CREATED: 0,
    OWNED: 1,
    CLOSED_TO_OWNED_DESTINATION: 2,
  };
  const accountStates = {};

  function isOwned(pubkey) {
    if (!pubkey) {
      return false;
    }
    if (
      publicKeys?.some((ownedAccountPubkey) =>
        ownedAccountPubkey.equals(pubkey),
      )
    ) {
      return true;
    }
    return accountStates[pubkey.toBase58()] === states.OWNED;
  }

  instructions.forEach((instruction) => {
    if (!instruction) {
      unsafe = true;
    } else {
      if (['cancelOrder', 'matchOrders'].includes(instruction.type)) {
        // It is always considered safe to cancel orders, match orders
      } else if (instruction.type === 'systemCreate') {
        let { newAccountPubkey } = instruction.data;
        if (!newAccountPubkey) {
          unsafe = true;
        } else {
          accountStates[newAccountPubkey.toBase58()] = states.CREATED;
        }
      } else if (instruction.type === 'newOrder') {
        // New order instructions are safe if the owner is this wallet
        let { openOrdersPubkey, ownerPubkey } = instruction.data;
        if (ownerPubkey && owner.equals(ownerPubkey)) {
          accountStates[openOrdersPubkey.toBase58()] = states.OWNED;
        } else {
          unsafe = true;
        }
      } else if (instruction.type === 'initializeAccount') {
        // New SPL token accounts are only considered safe if they are owned by this wallet and newly created
        let { ownerPubkey, accountPubkey } = instruction.data;
        if (
          owner &&
          ownerPubkey &&
          owner.equals(ownerPubkey) &&
          accountPubkey &&
          accountStates[accountPubkey.toBase58()] === states.CREATED
        ) {
          accountStates[accountPubkey.toBase58()] = states.OWNED;
        } else {
          unsafe = true;
        }
      } else if (instruction.type === 'settleFunds') {
        // Settling funds is only safe if the destinations are owned
        let { basePubkey, quotePubkey } = instruction.data;
        if (!isOwned(basePubkey) || !isOwned(quotePubkey)) {
          unsafe = true;
        }
      } else if (instruction.type === 'closeAccount') {
        // Closing is only safe if the destination is owned
        let { sourcePubkey, destinationPubkey } = instruction.data;
        if (isOwned(destinationPubkey)) {
          accountStates[sourcePubkey.toBase58()] =
            states.CLOSED_TO_OWNED_DESTINATION;
        } else {
          unsafe = true;
        }
      } else {
        unsafe = true;
      }
    }
  });

  // Check that all accounts are owned
  if (
    Object.values(accountStates).some(
      (state) =>
        ![states.CLOSED_TO_OWNED_DESTINATION, states.OWNED].includes(state),
    )
  ) {
    unsafe = true;
  }

  return !unsafe;
}

function ApproveSignatureForm({
  origin,
  message,
  onApprove,
  onReject,
  autoApprove,
}) {
  const classes = useStyles();
  const explorerUrlSuffix = useSolanaExplorerUrlSuffix();
  const connection = useConnection();
  const wallet = useWallet();
  const [publicKeys] = useWalletPublicKeys();

  const [parsing, setParsing] = useState(true);
  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    decodeMessage(connection, wallet, message).then((instructions) => {
      setInstructions(instructions);
      setParsing(false);
    });
  }, [message, connection, wallet]);

  const safe = useMemo(() => {
    return (
      publicKeys &&
      instructions &&
      isSafeInstruction(publicKeys, wallet.publicKey, instructions)
    );
  }, [publicKeys, instructions, wallet]);

  useEffect(() => {
    if (safe && autoApprove) {
      console.log('Auto approving safe transaction');
      onApprove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safe, autoApprove]);

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
      case 'matchOrders':
      case 'settleFunds':
        return (
          <DexInstruction
            instruction={instruction}
            onOpenAddress={onOpenAddress}
          />
        );
      case 'closeAccount':
      case 'initializeAccount':
      case 'transfer':
      case 'approve':
      case 'mintTo':
        return (
          <TokenInstruction
            instruction={instruction}
            onOpenAddress={onOpenAddress}
          />
        );
      case 'systemCreate':
      case 'systemTransfer':
        return (
          <SystemInstruction
            instruction={instruction}
            onOpenAddress={onOpenAddress}
          />
        );
      case 'newOrder':
        return (
          <NewOrder instruction={instruction} onOpenAddress={onOpenAddress} />
        );
      default:
        return <UnknownInstruction instruction={instruction} />;
    }
  };

  return (
    <Card>
      <CardContent>
        {parsing ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                marginBottom: 20,
              }}
            >
              <CircularProgress style={{ marginRight: 20 }} />
              <Typography
                variant="subtitle1"
                style={{ fontWeight: 'bold' }}
                gutterBottom
              >
                Parsing transaction:
              </Typography>
            </div>
            <Typography style={{ wordBreak: 'break-all' }}>
              {bs58.encode(message)}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {instructions
                ? `${origin} wants to:`
                : `Unknown transaction data`}
            </Typography>
            {instructions ? (
              instructions.map((instruction, i) => (
                <Box style={{ marginTop: 20 }} key={i}>
                  {getContent(instruction)}
                  <Divider style={{ marginTop: 20 }} />
                </Box>
              ))
            ) : (
              <>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: 'bold' }}
                  gutterBottom
                >
                  Unknown transaction:
                </Typography>
                <Typography style={{ wordBreak: 'break-all' }}>
                  {bs58.encode(message)}
                </Typography>
              </>
            )}
            {!safe && (
              <SnackbarContent
                className={classes.warningContainer}
                message={
                  <div>
                    <span className={classes.warningTitle}>
                      <WarningIcon className={classes.warningIcon} />
                      Nonstandard DEX transaction
                    </span>
                    <Typography className={classes.warningMessage}>
                      Sollet does not recognize this transaction as a standard
                      Serum DEX transaction
                    </Typography>
                  </div>
                }
                classes={{ root: classes.snackbarRoot }}
              />
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

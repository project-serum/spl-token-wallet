import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet, useWalletPublicKeys } from '../utils/wallet';
import { decodeMessage } from '../utils/transactions';
import { useConnection, useSolanaExplorerUrlSuffix } from '../utils/connection';
import {
  Divider,
  FormControlLabel,
  SnackbarContent,
  Switch,
  Typography,
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
  const { t } = useTranslation();

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
    if (connectedAccount && !connectedAccount.equals(wallet.publicKey)) {
      setConnectedAccount(null);
    }
  }, [connectedAccount, wallet]);

  // Push requests from the parent window into a queue.
  useEffect(() => {
    function messageHandler(e) {
      if (e.origin === origin && e.source === window.opener) {
        if (
          e.data.method !== 'signTransaction' &&
          e.data.method !== 'signAllTransactions'
        ) {
          postMessage({ error: t("unsupported_method"), id: e.data.id });
        }

        setRequests((requests) => [...requests, e.data]);
      }
    }
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [origin, postMessage, t]);

  if (!connectedAccount || !connectedAccount.equals(wallet.publicKey)) {
    // Approve the parent page to connect to this wallet.
    function connect(autoApprove) {
      setConnectedAccount(wallet.publicKey);
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
    assert(
      request.method === 'signTransaction' ||
        request.method === 'signAllTransactions',
    );

    let messages =
      request.method === 'signTransaction'
        ? [bs58.decode(request.params.message)]
        : request.params.messages.map((m) => bs58.decode(m));

    async function onApprove() {
      setRequests((requests) => requests.slice(1));
      if (request.method === 'signTransaction') {
        sendSignature(messages[0]);
      } else {
        sendAllSignatures(messages);
      }
      if (requests.length === 1) {
        focusParent();
      }
    }

    async function sendSignature(message) {
      postMessage({
        result: {
          signature: await wallet.createSignature(message),
          publicKey: wallet.publicKey.toBase58(),
        },
        id: request.id,
      });
    }

    async function sendAllSignatures(messages) {
      const signatures = await Promise.all(
        messages.map((m) => wallet.createSignature(m)),
      );
      postMessage({
        result: {
          signatures,
          publicKey: wallet.publicKey.toBase58(),
        },
        id: request.id,
      });
    }

    function sendReject() {
      setRequests((requests) => requests.slice(1));
      postMessage({
        error: t("transaction_cancelled"),
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
        messages={messages}
        onApprove={onApprove}
        onReject={sendReject}
      />
    );
  }

  return (
    <Typography>{t("keep_window_open")}</Typography>
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
  approveButton: {
    backgroundColor: '#43a047',
    color: 'white',
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
  const { t } = useTranslation();
  let [dismissed, setDismissed] = useLocalStorageState(
    'dismissedAutoApproveWarning',
    false,
  );
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h1" gutterBottom>
          {t("allow_site")}
        </Typography>
        <div className={classes.connection}>
          <Typography>{origin}</Typography>
          <ImportExportIcon fontSize="large" />
          <Typography>{wallet.publicKey.toBase58()}</Typography>
        </div>
        <Typography>{t("only_sites_you_trust")}</Typography>
        <Divider className={classes.divider} />
        <FormControlLabel
          control={
            <Switch
              checked={autoApprove}
              onChange={() => setAutoApprove(!autoApprove)}
              color="primary"
            />
          }
          label={t("auto_approve_from_origin", { origin })}
        />
        {!dismissed && autoApprove && (
          <SnackbarContent
            className={classes.warningContainer}
            message={
              <div>
                <span className={classes.warningTitle}>
                  <WarningIcon className={classes.warningIcon} />
                  {t("use_at_your_own_risk")}
                </span>
                <Typography className={classes.warningMessage}>
                  {t("allow_send_transactions")}
                </Typography>
              </div>
            }
            action={[
              <Button onClick={() => setDismissed('1')}>{t("i_understand")}</Button>,
            ]}
            classes={{ root: classes.snackbarRoot }}
          />
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        <Button onClick={window.close}>{t("cancel")}</Button>
        <Button
          color="primary"
          onClick={() => onApprove(autoApprove)}
          disabled={!dismissed && autoApprove}
        >
          {t("connect")}
        </Button>
      </CardActions>
    </Card>
  );
}

function isSafeInstruction(publicKeys, owner, txInstructions) {
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

  txInstructions.forEach((instructions) => {
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
  messages,
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
  // An array of arrays, where each element is the set of instructions for a
  // single transaction.
  const [txInstructions, setTxInstructions] = useState(null);
  const buttonRef = useRef();
  const { t } = useTranslation();

  const isMultiTx = messages.length > 1;

  useEffect(() => {
    Promise.all(messages.map((m) => decodeMessage(connection, wallet, m))).then(
      (txInstructions) => {
        setTxInstructions(txInstructions);
        setParsing(false);
      },
    );
  }, [messages, connection, wallet]);

  const validator = useMemo(() => {
    return {
      safe:
        publicKeys &&
        txInstructions &&
        isSafeInstruction(publicKeys, wallet.publicKey, txInstructions),
    };
  }, [publicKeys, txInstructions, wallet]);

  useEffect(() => {
    if (validator.safe && autoApprove) {
      console.log('Auto approving safe transaction');
      onApprove();
    } else {
      // brings window to front when we receive new instructions
      // this needs to be executed from wallet instead of adapter
      // to ensure chrome brings window to front
      window.focus();

      // scroll to approve button and focus it to enable approve with enter
      if (buttonRef.current) {
        buttonRef.current.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => buttonRef.current.focus(), 50);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validator, autoApprove, buttonRef]);

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

  const txLabel = (idx) => {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          {t("transaction_id", { id: idx.toString() })}
        </Typography>
        <Divider style={{ marginTop: 20 }} />
      </>
    );
  };

  const txListItem = (instructions, txIdx) => {
    const ixs = instructions.map((instruction, i) => (
      <Box style={{ marginTop: 20 }} key={i}>
        {getContent(instruction)}
        <Divider style={{ marginTop: 20 }} />
      </Box>
    ));

    if (!isMultiTx) {
      return ixs;
    }

    return (
      <Box style={{ marginTop: 20 }} key={txIdx}>
        {txLabel(txIdx)}
        {ixs}
      </Box>
    );
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
                Parsing transaction{isMultiTx > 0 ? 's' : ''}:
              </Typography>
            </div>
            {messages.map((message, idx) => (
              <Typography key={idx} style={{ wordBreak: 'break-all' }}>
                {bs58.encode(message)}
              </Typography>
            ))}
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {txInstructions
                ? `${origin} wants to:`
                : `Unknown transaction data`}
            </Typography>
            {txInstructions ? (
              txInstructions.map((instructions, txIdx) =>
                txListItem(instructions, txIdx),
              )
            ) : (
              <>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: 'bold' }}
                  gutterBottom
                >
                  Unknown transaction{isMultiTx > 0 ? 's' : ''}:
                </Typography>
                {messages.map((message) => (
                  <Typography style={{ wordBreak: 'break-all' }}>
                    {bs58.encode(message)}
                  </Typography>
                ))}
              </>
            )}
            {!validator.safe && (
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
        <Button onClick={onReject}>{t("cancel")}</Button>
        <Button
          ref={buttonRef}
          className={classes.approveButton}
          variant="contained"
          color="primary"
          onClick={onApprove}
        >
          Approve{isMultiTx ? ' All' : ''}
        </Button>
      </CardActions>
    </Card>
  );
}

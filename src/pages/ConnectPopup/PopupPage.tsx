import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { useWallet, useWalletPublicKeys } from '../../utils/wallet';
import { decodeMessage } from '../../utils/transactions';
import {
  useConnection,
  useSolanaExplorerUrlSuffix,
} from '../../utils/connection';
import { Divider, Typography, useTheme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ImportExportIcon from '../../images/importExportIcon.svg';
import Logo from '../../images/oldLogo.svg';
import { makeStyles } from '@material-ui/core/styles';
import assert from 'assert';
import bs58 from 'bs58';
import NewOrder from '../../components/instructions/NewOrder';
import UnknownInstruction from '../../components/instructions/UnknownInstruction';
import SystemInstruction from '../../components/instructions/SystemInstruction';
import DexInstruction from '../../components/instructions/DexInstruction';
import TokenInstruction from '../../components/instructions/TokenInstruction';
import {
  RowContainer,
  VioletButton,
  WhiteButton,
  Row,
  StyledLabel,
  Title,
  StyledCheckbox,
} from '../commonStyles';

import AccountsSelector from '../Wallet/components/AccountsSelector';
import AttentionComponent from '../../components/Attention';
import { PublicKey } from '@solana/web3.js';

const StyledCard = styled(Card)`
  background: #17181a;
  color: #ecf0f3;
  text-align: center;
  width: 50rem;
  padding: 3rem;
  margin: 0 auto;
  box-shadow: none;
`;

export default function PopupPage({ origin }) {
  const opener = window.opener;
  const wallet = useWallet();

  // const origin = useMemo(() => {
  //   let params = new URLSearchParams(window.location.hash.slice(1));
  //   return params.get('origin');
  // }, []);

  const postMessage = useCallback(
    (message) => {
      opener.postMessage({ jsonrpc: '2.0', ...message }, origin);
    },
    [opener, origin],
  );

  const [connectedAccount, setConnectedAccount] = useState<PublicKey | null>(
    null,
  );
  const hasConnectedAccount = !!connectedAccount;
  const [requests, setRequests] = useState<any[]>([]);
  const [autoApprove, setAutoApprove] = useState(false);

  useEffect(() => {
    if (!wallet) {
      postMessage({ method: 'redirect' });
    }
  }, [postMessage, wallet]);

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
          postMessage({ error: 'Unsupported method', id: e.data.id });
        }

        setRequests((requests) => [...requests, e.data]);
      }
    }
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [origin, postMessage]);

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
        error: 'Transaction cancelled',
        id: request.id,
      });
      if (requests.length === 1) {
        focusParent();
      }
    }
    return (
      <StyledCard style={{ textAlign: 'left', overflowY: 'auto', height: '100%' }}>
        <ApproveSignatureForm
          key={request.id}
          autoApprove={autoApprove}
          origin={origin}
          messages={messages}
          onApprove={onApprove}
          onReject={sendReject}
        />
      </StyledCard>
    );
  }

  return (
    <RowContainer height={'calc(100% - 6rem)'}>
      <Title>Please keep this window open in the background.</Title>
    </RowContainer>
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
  approveButton: {
    backgroundColor: '#43a047',
    color: 'white',
  },
  actions: {
    justifyContent: 'space-between',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function ApproveConnectionForm({ origin, onApprove }) {
  const wallet = useWallet();
  const classes = useStyles();
  const [autoApprove, setAutoApprove] = useState(true);

  const theme = useTheme();

  return (
    <StyledCard>
      {(!window.opener || !wallet) && <Redirect to="/" />}
      <CardContent style={{ padding: 0 }}>
        <RowContainer margin={'0 0 2rem 0'} justify={'space-between'}>
          <img style={{ width: '50%' }} alt={'logo'} src={Logo} />
          <AccountsSelector isFromPopup accountNameSize={'1.6rem'} />
        </RowContainer>
        <Title
          fontSize="2.4rem"
          fontFamily="Avenir Next Demi"
          style={{ marginBottom: '3rem' }}
        >
          Allow this site to access your Wallet™?
        </Title>
        <RowContainer
          margin={'0 0 4rem 0'}
          direction={'column'}
          className={classes.connection}
        >
          <RowContainer margin="6rem 0 0 0">
            <Title>{origin}</Title>
          </RowContainer>
          <img
            alt={'import export icon'}
            style={{ margin: '2rem 0' }}
            src={ImportExportIcon}
          />
          <Title fontSize="1.6rem">{wallet?.publicKey?.toBase58()}</Title>
        </RowContainer>

        <RowContainer direction={'row'}>
          <StyledCheckbox
            id="autoApprove"
            theme={theme}
            checked={autoApprove}
            onChange={() => setAutoApprove(!autoApprove)}
          />
          <Row style={{ textAlign: 'left' }}>
            <StyledLabel
              theme={theme}
              htmlFor="autoApprove"
              style={{ fontSize: '1.6rem' }}
            >
              Automatically approve transactions from{' '}
              <span style={{ color: '#ECF0F3' }}>{origin}</span>.<br />
              This will allow you to use the auto-settle function.
            </StyledLabel>
          </Row>
        </RowContainer>
        <RowContainer margin="6rem 0 0 0">
          <AttentionComponent
            text={
              'Only connect with sites you trust. Auto approve allows sending some transactions on your behalf without requesting your permission for the remainder of this session.'
            }
            textStyle={{ fontSize: '1.6rem', textAlign: 'left' }}
            iconStyle={{ height: '7rem', margin: '0 2rem 0 3rem' }}
          />
        </RowContainer>
      </CardContent>
      <RowContainer margin="6rem 0 0 0" justify={'space-between'}>
        <WhiteButton
          width={'calc(50% - .5rem)'}
          theme={theme}
          color={'#ECF0F3'}
          onClick={window.close}
        >
          Cancel
        </WhiteButton>
        <VioletButton
          theme={theme}
          width={'calc(50% - .5rem)'}
          onClick={() => onApprove(autoApprove)}
        >
          Connect
        </VioletButton>
      </RowContainer>
    </StyledCard>
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

  console.log('txInstructions', txInstructions)

  txInstructions.forEach((instructions) => {
    instructions.forEach((instruction) => {
      if (!instruction) {
        unsafe = true;
      } else {
        if (instruction.type === 'raydium') {
          // Whitelist raydium for now.
        } else if (
          ['cancelOrder', 'cancelOrderV2', 'matchOrders', 'cancelOrderV3'].includes(
            instruction.type,
          )
        ) {
          // It is always considered safe to cancel orders, match orders
        } else if (instruction.type === 'systemCreate') {
          let { newAccountPubkey } = instruction.data;
          if (!newAccountPubkey) {
            unsafe = true;
          } else {
            accountStates[newAccountPubkey.toBase58()] = states.CREATED;
          }
        } else if (['newOrder', 'newOrderV3'].includes(instruction.type)) {
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
      (state: any) =>
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
  // const classes = useStyles();
  const explorerUrlSuffix = useSolanaExplorerUrlSuffix();
  const connection = useConnection();
  const wallet = useWallet();
  const [publicKeys] = useWalletPublicKeys();

  const [parsing, setParsing] = useState(true);
  // An array of arrays, where each element is the set of instructions for a
  // single transaction.
  const [txInstructions, setTxInstructions] = useState<any>(null);
  const buttonRef: any = useRef();
  const theme = useTheme();

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
        buttonRef?.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => buttonRef?.current?.focus(), 50);
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
      case 'cancelOrderV2':
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
      case 'newOrderV3':
        return (
          <NewOrder
            instruction={instruction}
            onOpenAddress={onOpenAddress}
            v3={true}
          />
        );
      default:
        return <UnknownInstruction instruction={instruction} />;
    }
  };

  const txLabel = (idx) => {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Transaction {idx.toString()}
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
    <>
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
              <Title
                fontSize="1.6rem"
                fontFamily="Avenir Next Demi"
                gutterBottom
              >
                Parsing transaction{isMultiTx ? 's' : ''}:
              </Title>
            </div>
            {messages.map((message, idx) => (
              <Typography key={idx} style={{ wordBreak: 'break-all' }}>
                {bs58.encode(message)}
              </Typography>
            ))}
          </>
        ) : (
          <>
            <Title fontSize="1.6rem" gutterBottom>
              {txInstructions
                ? `${origin} wants to:`
                : `Unknown transaction data`}
            </Title>
            {txInstructions ? (
              txInstructions.map((instructions, txIdx) =>
                txListItem(instructions, txIdx),
              )
            ) : (
              <>
                <Title
                  fontSize="1.6rem"
                  fontFamily="Avenir Next Demi"
                  gutterBottom
                >
                  Unknown transaction{isMultiTx ? 's' : ''}:
                </Title>
                {messages.map((message) => (
                  <Title style={{ wordBreak: 'break-all' }}>
                    {bs58.encode(message)}
                  </Title>
                ))}
              </>
            )}
          </>
        )}
      </CardContent>
      <RowContainer justify="space-between">
        <WhiteButton theme={theme} width="calc(50% - .5rem)" onClick={onReject}>
          Cancel
        </WhiteButton>
        <VioletButton
          theme={theme}
          width="calc(50% - .5rem)"
          onClick={onApprove}
        >
          Approve{isMultiTx ? ' All' : ''}
        </VioletButton>
      </RowContainer>
    </>
  );
}

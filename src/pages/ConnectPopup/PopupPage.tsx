import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { useWallet, useWalletSelector } from '../../utils/wallet';
import { useTheme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ImportExportIcon from '../../images/importExportIcon.svg';
import { makeStyles } from '@material-ui/core/styles';
import assert from 'assert';
import bs58 from 'bs58';
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
import LogoComponent from '../../components/Logo';
import { isExtension } from '../../utils/utils';
import SignTransactionFormContent from './SignTransactionFormContent';
import SignFormContent from './SignFormContent';
import { footerHeight } from '../../components/Navbar/NavigationFrame';
import NetworkDropdown from '../../components/Navbar/NetworkDropdown';

const StyledCard = styled(Card)`
  background: #17181a;
  color: #ecf0f3;
  text-align: center;
  width: 50rem;
  margin: 0 auto;
  box-shadow: none;
`;

export default function PopupPage() {
  const opener = window.opener;

  const origin: any = sessionStorage.getItem('origin');
  const hash: any = sessionStorage.getItem('hash');

  const selectedWallet = useWallet();
  const selectedWalletAddress =
    selectedWallet && selectedWallet.publicKey.toBase58();
  const { accounts, setWalletSelector } = useWalletSelector();
  const [wallet, setWallet] = useState(isExtension ? null : selectedWallet);

  const postMessage = useCallback(
    (message) => {
      if (isExtension) {
        chrome.runtime.sendMessage({
          channel: 'ccai_extension_background_channel',
          data: message,
        });
      } else {
        opener.postMessage({ jsonrpc: '2.0', ...message }, origin);
      }
    },
    [opener, origin],
  );

  const [connectedAccount, setConnectedAccount] = useState<PublicKey | null>(
    null,
  );
  const hasConnectedAccount = !!connectedAccount;
  const [requests, setRequests] = useState<any[]>(getInitialRequests(hash));
  const [autoApprove, setAutoApprove] = useState(true);

  // Keep selectedWallet and wallet in sync.
  useEffect(() => {
    if (!isExtension) {
      setWallet(selectedWallet);
    }
    // using stronger condition here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWalletAddress]);

  // (Extension only) Fetch connected wallet for site from local storage.
  useEffect(() => {
    if (isExtension) {
      chrome.storage.local.get('connectedWallets', (result) => {
        const connectedWallet = (result.connectedWallets || {})[origin];
        if (connectedWallet) {
          setWalletSelector(connectedWallet.selector);
          setConnectedAccount(new PublicKey(connectedWallet.publicKey));
          setAutoApprove(connectedWallet.autoApprove);
        } else {
          setConnectedAccount(selectedWallet.publicKey);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin]);

  // (Extension only) Set wallet once connectedWallet is retrieved.
  useEffect(() => {
    if (isExtension && connectedAccount) {
      setWallet(selectedWallet);
    }
  }, [connectedAccount, selectedWallet]);

  // Send a disconnect event if this window is closed, this component is
  // unmounted, or setConnectedAccount(null) is called.
  useEffect(() => {
    if (hasConnectedAccount && !isExtension) {
      function unloadHandler() {
        postMessage({ method: 'disconnected' });
      }
      window.addEventListener('beforeunload', unloadHandler);
      return () => {
        unloadHandler();
        window.removeEventListener('beforeunload', unloadHandler);
      };
    }
  }, [hasConnectedAccount, postMessage, origin]);

  // Disconnect if the user switches to a different wallet.
  useEffect(() => {
    if (
      !isExtension &&
      wallet &&
      connectedAccount &&
      !connectedAccount.equals(wallet.publicKey)
    ) {
      setConnectedAccount(null);
    }
  }, [connectedAccount, wallet]);

  // Push requests from the parent window into a queue.
  useEffect(() => {
    function messageHandler(e) {
      if (e.origin === origin && e.source === window.opener) {
        if (
          e.data.method !== 'signTransaction' &&
          e.data.method !== 'signAllTransactions' &&
          e.data.method !== 'sign'
        ) {
          postMessage({ error: 'Unsupported method', id: e.data.id });
        }

        setRequests((requests) => [...requests, e.data]);
      }
    }
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [origin, postMessage]);

  const request = requests[0];
  const popRequest = () => setRequests((requests) => requests.slice(1));

  if (hasConnectedAccount && requests.length === 0) {
    if (isExtension) {
      window.close();
    } else {
      focusParent();
    }

    return (
      <RowContainer height={`calc(100% - ${footerHeight}rem)`}>
        <Title style={{ fontSize: '2rem' }}>
          {isExtension
            ? 'Submitting...'
            : 'Please keep this window open in the background.'}
        </Title>
      </RowContainer>
    );
  }

  if (!wallet) {
    return (
      <RowContainer height={`calc(100% - ${footerHeight}rem)`}>
        <Title style={{ fontSize: '2rem' }}>Loading wallet...</Title>
      </RowContainer>
    );
  }

  const mustConnect =
    !connectedAccount || !connectedAccount.equals(wallet.publicKey);
  // We must detect when to show the connection form on the website as it is not sent as a request.
  if (
    (isExtension && request.method === 'connect') ||
    (!isExtension && mustConnect)
  ) {
    // Approve the parent page to connect to this wallet.
    function connect(autoApprove) {
      setConnectedAccount(wallet.publicKey);
      if (isExtension) {
        chrome.storage.local.get('connectedWallets', (result) => {
          // TODO better way to do this
          const account = accounts.find((account) =>
            account.address.equals(wallet.publicKey),
          );
          const connectedWallets = {
            ...(result.connectedWallets || {}),
            [origin]: {
              publicKey: wallet.publicKey.toBase58(),
              selector: account.selector,
              autoApprove,
            },
          };
          chrome.storage.local.set({ connectedWallets });
        });
      }
      postMessage({
        method: 'connected',
        params: { publicKey: wallet.publicKey.toBase58(), autoApprove },
        id: isExtension ? request.id : undefined,
      });
      setAutoApprove(autoApprove);
      if (!isExtension) {
        focusParent();
      } else {
        popRequest();
      }
    }

    return (
      <ApproveConnectionForm
        origin={origin}
        onApprove={connect}
        autoApprove={autoApprove}
        setAutoApprove={setAutoApprove}
      />
    );
  }

  assert(
    (request.method === 'signTransaction' ||
      request.method === 'signAllTransactions' ||
      request.method === 'sign') &&
      wallet,
  );

  let messages, messageDisplay;
  switch (request.method) {
    case 'signTransaction':
      messages = [bs58.decode(request.params.message)];
      messageDisplay = 'tx';
      break;
    case 'signAllTransactions':
      messages = request.params.messages.map((m) => bs58.decode(m));
      messageDisplay = 'tx';
      break;
    case 'sign':
      if (!(request.params.data instanceof Uint8Array)) {
        throw new Error('Data must be an instance of Uint8Array');
      }
      messages = [request.params.data];
      messageDisplay = request.params.display === 'utf8' ? 'utf8' : 'hex';
      break;
    default:
      throw new Error('Unexpected method: ' + request.method);
  }

  async function onApprove() {
    popRequest();
    switch (request.method) {
      case 'signTransaction':
      case 'sign':
        sendSignature(messages[0]);
        break;
      case 'signAllTransactions':
        sendAllSignatures(messages);
        break;
      default:
        throw new Error('Unexpected method: ' + request.method);
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
    console.log('wallet', wallet);
    let signatures;
    // Ledger must sign one by one.
    if (wallet.type === 'ledger') {
      signatures = [];
      for (let k = 0; k < messages.length; k += 1) {
        signatures.push(await wallet.createSignature(messages[k]));
      }
    } else {
      signatures = await Promise.all(
        messages.map((m) => wallet.createSignature(m)),
      );
    }
    postMessage({
      result: {
        signatures,
        publicKey: wallet.publicKey.toBase58(),
      },
      id: request.id,
    });
  }

  function sendReject() {
    popRequest();
    postMessage({
      error: 'Transaction cancelled',
      id: request.id,
    });
  }

  return (
    <StyledCard
      style={{ textAlign: 'left', overflowY: 'auto', height: '100%' }}
    >
      <ApproveSignatureForm
        key={request.id}
        autoApprove={autoApprove}
        origin={origin}
        messages={messages}
        messageDisplay={messageDisplay}
        onApprove={onApprove}
        onReject={sendReject}
      />
    </StyledCard>
  );
}

/**
 * Switch focus to the parent window. This requires that the parent runs
 * `window.name = 'parent'` before opening the popup.
 */
function focusParent() {
  try {
    // window.opener?.focus()
    const parent = window.open('', 'parent')
    parent?.focus()
  } catch (err) {
    console.log('err', err);
  }
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

function getInitialRequests(hash: string) {
  if (!isExtension) {
    return [];
  }

  // TODO CHECK OPENER (?)

  const urlParams = new URLSearchParams(hash.slice(1));
  let request;

  try {
    request = JSON.parse(urlParams?.get('request') || 'null');
  } catch (e) {
    console.error('getInitialRequests error', e);
  }

  if (request?.method === 'sign') {
    const dataObj = request.params.data;
    // Deserialize `data` into a Uint8Array
    if (!dataObj) {
      throw new Error('Missing "data" params for "sign" request');
    }

    const data = new Uint8Array(Object.keys(dataObj).length);
    for (const [index, value] of Object.entries(dataObj)) {
      data[index] = value;
    }
    request.params.data = data;
  }

  return [request];
}

function ApproveConnectionForm({
  origin,
  onApprove,
  autoApprove,
  setAutoApprove,
}) {
  const wallet = useWallet();
  const classes = useStyles();
  const { accounts, hardwareWalletAccount } = useWalletSelector();
  // TODO better way to do this
  const allAccounts = hardwareWalletAccount
    ? [hardwareWalletAccount, ...accounts]
    : accounts;

  const account = allAccounts.find((account) =>
    account.address.equals(wallet.publicKey),
  );
  // const [autoApprove, setAutoApprove] = useState(true);

  const theme = useTheme();

  return (
    <StyledCard>
      {(!window.opener || !wallet) && <Redirect to="/" />}
      <CardContent style={{ padding: 0 }}>
        <RowContainer margin={'0 0 2rem 0'} justify={'space-between'}>
          <LogoComponent width="12rem" height="auto" margin="0" />
          <NetworkDropdown popupPage={true} width={'14rem'} />
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
          <Title fontSize="1.6rem">{account?.name}</Title>
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
              Automatically approve transactions from
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

function ApproveSignatureForm({
  origin,
  messages,
  messageDisplay,
  onApprove,
  onReject,
  autoApprove,
}) {
  const theme = useTheme();
  const buttonRef = useRef();

  const isMultiTx = messageDisplay === 'tx' && messages.length > 1;

  const renderFormContent = () => {
    if (messageDisplay === 'tx') {
      return (
        <SignTransactionFormContent
          autoApprove={autoApprove}
          origin={origin}
          messages={messages}
          onApprove={onApprove}
          buttonRef={buttonRef}
        />
      );
    } else {
      return (
        <SignFormContent
          origin={origin}
          message={messages[0]}
          messageDisplay={messageDisplay}
          buttonRef={buttonRef}
        />
      );
    }
  };

  return (
    <>
      <CardContent>{renderFormContent()}</CardContent>
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

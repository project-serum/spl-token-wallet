import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Tabs, Input, Space, Typography, Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useWallet } from '../utils/wallet';
import { PublicKey } from '@solana/web3.js';
import { abbreviateAddress } from '../utils/utils';
import { useCallAsync, useSendTransaction } from '../utils/notifications';
import { swapApiRequest, useSwapApiGet } from '../utils/swap/api';
import { showSwapAddress } from '../utils/config';
import {
  ConnectToMetamaskButton,
  useEthAccount,
  withdrawEth,
} from '../utils/swap/eth';
import { useConnection, useIsProdNetwork } from '../utils/connection';
import { useAsyncData } from '../utils/fetch-loop';
import TokenIcon from './TokenIcon';

const { TabPane } = Tabs;
const { Paragraph } = Typography;
const { Step } = Steps;

export default function SendDialog({ open, onClose, publicKey, balanceInfo }) {
  const isProdNetwork = useIsProdNetwork();
  const [tab, setTab] = useState('0');
  const onSubmitRef = useRef();

  const [swapCoinInfo] = useSwapApiGet(
    showSwapAddress && balanceInfo.mint && isProdNetwork
      ? `coins/sol/${balanceInfo.mint.toBase58()}`
      : null,
  );
  const ethAccount = useEthAccount();

  const { mint, tokenName, tokenSymbol } = balanceInfo;

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TokenIcon mint={mint} tokenName={tokenName} />
            <span style={{ marginLeft: 16 }}>
              Send {tokenName ?? abbreviateAddress(mint)}{' '}
              {tokenSymbol ? `(${tokenSymbol})` : null}
            </span>
          </div>
        }
        visible={open}
        onCancel={onClose}
        footer={null}
      >
        {swapCoinInfo ? (
          <Tabs activeKey={tab} onChange={setTab} centered>
            <TabPane tab={`SPL ${swapCoinInfo.ticker}`} key="0" />
            <TabPane
              tab={`${swapCoinInfo.erc20Contract ? 'ERC20' : 'Native'} ${
                swapCoinInfo.ticker
              }`}
              key="1"
            />
          </Tabs>
        ) : null}
        {tab === '0' ? (
          <SendSplDialog
            onClose={onClose}
            publicKey={publicKey}
            balanceInfo={balanceInfo}
            onSubmitRef={onSubmitRef}
          />
        ) : (
          <SendSwapDialog
            onClose={onClose}
            publicKey={publicKey}
            balanceInfo={balanceInfo}
            swapCoinInfo={swapCoinInfo}
            ethAccount={ethAccount}
            onSubmitRef={onSubmitRef}
          />
        )}
      </Modal>
      {ethAccount &&
      (swapCoinInfo?.blockchain === 'eth' || swapCoinInfo?.erc20Contract) ? (
        <EthWithdrawalCompleter ethAccount={ethAccount} publicKey={publicKey} />
      ) : null}
    </>
  );
}

function SendSplDialog({ onClose, publicKey, balanceInfo, onSubmitRef }) {
  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const {
    fields,
    destinationAddress,
    transferAmountString,
    validAmount,
  } = useForm(balanceInfo);
  const { decimals } = balanceInfo;

  async function makeTransaction() {
    let amount = Math.round(parseFloat(transferAmountString) * 10 ** decimals);
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    return wallet.transferToken(
      publicKey,
      new PublicKey(destinationAddress),
      amount,
    );
  }

  async function onSubmit() {
    return sendTransaction(makeTransaction(), { onSuccess: onClose });
  }
  onSubmitRef.current = onSubmit;
  return (
    <>
      {fields}
      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          disabled={sending || !validAmount || !destinationAddress}
          onClick={onSubmit}
        >
          Send
        </Button>
      </Space>
    </>
  );
}

function SendSwapDialog({
  onClose,
  publicKey,
  balanceInfo,
  swapCoinInfo,
  ethAccount,
  onSubmitRef,
}) {
  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const [signature, setSignature] = useState(null);
  const {
    fields,
    destinationAddress,
    transferAmountString,
    setDestinationAddress,
    validAmount,
  } = useForm(balanceInfo);

  const { tokenName, decimals, mint } = balanceInfo;
  const blockchain =
    swapCoinInfo.blockchain === 'sol' ? 'eth' : swapCoinInfo.blockchain;
  const needMetamask = blockchain === 'eth';

  useEffect(() => {
    if (blockchain === 'eth' && ethAccount) {
      setDestinationAddress(ethAccount);
    }
  }, [blockchain, ethAccount, setDestinationAddress]);

  async function makeTransaction() {
    let amount = Math.round(parseFloat(transferAmountString) * 10 ** decimals);
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    const swapInfo = await swapApiRequest('POST', 'swap_to', {
      blockchain,
      coin: swapCoinInfo.erc20Contract,
      address: destinationAddress,
      size: amount / 10 ** decimals,
      wusdcToUsdc:
        mint?.toBase58() === 'BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW',
    });
    if (swapInfo.blockchain !== 'sol') {
      throw new Error('Unexpected blockchain');
    }
    return wallet.transferToken(
      publicKey,
      new PublicKey(swapInfo.address),
      amount,
      swapInfo.memo,
    );
  }

  async function onSubmit() {
    return sendTransaction(makeTransaction(), { onSuccess: setSignature });
  }
  onSubmitRef.current = onSubmit;

  if (signature) {
    return (
      <SendSwapProgress
        key={signature}
        publicKey={publicKey}
        signature={signature}
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <Paragraph>
        SPL {tokenName} can be converted to{' '}
        {swapCoinInfo.erc20Contract ? 'ERC20' : 'native'} {swapCoinInfo.ticker}
        {needMetamask ? ' via MetaMask' : null}.
      </Paragraph>
      {needMetamask && !ethAccount ? <ConnectToMetamaskButton /> : fields}
      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          disabled={sending || (needMetamask && !ethAccount) || !validAmount}
          onClick={onSubmit}
        >
          Send
        </Button>
      </Space>
    </>
  );
}

function SendSwapProgress({ publicKey, signature, onClose }) {
  const connection = useConnection();
  const [swaps] = useSwapApiGet(`swaps_from/sol/${publicKey.toBase58()}`, {
    refreshInterval: 1000,
  });
  const [confirms] = useAsyncData(
    async () => {
      const { value } = await connection.getSignatureStatus(signature);
      return value?.confirmations;
    },
    [connection.getSignatureStatus, signature],
    { refreshInterval: 2000 },
  );

  let step = 0;
  let ethTxid = null;
  for (let swap of swaps || []) {
    const { deposit, withdrawal } = swap;
    if (deposit.txid === signature) {
      if (withdrawal.txid?.startsWith('0x')) {
        step = 3;
        ethTxid = withdrawal.txid;
      } else {
        step = 1;
      }
    }
  }

  return (
    <>
      <Space direction="vertical">
        <Steps current={step} direction="vertical">
          <Step
            title="Send Request"
            description={step === 0 && 'Transaction Pending'}
            icon={step === 0 && <LoadingOutlined />}
          />
          <Step
            title="Wait for Confirmations"
            description={
              step === 1 && (
                <div>
                  <span>{`${confirms} / 35 Confirmations`}</span>
                  <Paragraph>
                    Please keep this window open. You will need to approve the
                    request on MetaMask to complete the transaction.
                  </Paragraph>
                </div>
              )
            }
            icon={step === 1 && <LoadingOutlined />}
          />
          <Step
            title="Withdraw Funds"
            description={
              step === 3 && (
                <Button
                  type="link"
                  component="a"
                  href={`https://etherscan.io/tx/${ethTxid}`}
                  target="_blank"
                  rel="noopener"
                >
                  View on Etherscan
                </Button>
              )
            }
          />
        </Steps>
      </Space>
      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Close</Button>
      </Space>
    </>
  );
}

function useForm(balanceInfo) {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [transferAmountString, setTransferAmountString] = useState('');
  const { amount: balanceAmount, decimals, tokenSymbol } = balanceInfo;

  const parsedAmount = parseFloat(transferAmountString) * 10 ** decimals;
  const validAmount = parsedAmount > 0 && parsedAmount <= balanceAmount;

  const fields = (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Input
        placeholder="Recipient Address"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value.trim())}
      />
      <Input
        placeholder="Amount"
        type="number"
        value={transferAmountString}
        onChange={(e) => setTransferAmountString(e.target.value.trim())}
        step={Math.pow(10, -decimals)}
        suffix={tokenSymbol}
      />
      <Button
        type="primary"
        onClick={() =>
          setTransferAmountString(
            (balanceAmount / Math.pow(10, decimals)).toFixed(decimals),
          )
        }
      >
        Max: {balanceAmount / Math.pow(10, decimals)}
      </Button>
    </Space>
  );

  return {
    fields,
    destinationAddress,
    transferAmountString,
    setDestinationAddress,
    validAmount,
  };
}

function EthWithdrawalCompleter({ ethAccount, publicKey }) {
  const [swaps] = useSwapApiGet(`swaps_from/sol/${publicKey.toBase58()}`, {
    refreshInterval: 10000,
  });
  if (!swaps) {
    return null;
  }
  return swaps.map((swap) => (
    <EthWithdrawalCompleterItem
      key={swap.deposit.txid}
      ethAccount={ethAccount}
      swap={swap}
    />
  ));
}

function EthWithdrawalCompleterItem({ ethAccount, swap }) {
  const callAsync = useCallAsync();
  const { withdrawal } = swap;
  useEffect(() => {
    if (
      withdrawal.status === 'sent' &&
      withdrawal.blockchain === 'eth' &&
      withdrawal.txid &&
      !withdrawal.txid.startsWith('0x') &&
      withdrawal.txData
    ) {
      withdrawEth(ethAccount, withdrawal, callAsync);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawal.txid, withdrawal.status]);
  return null;
}

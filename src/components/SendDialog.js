import React, { useEffect, useRef, useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogForm from './DialogForm';
import { useWallet } from '../utils/wallet';
import { PublicKey } from '@solana/web3.js';
import { abbreviateAddress } from '../utils/utils';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useSendTransaction } from '../utils/notifications';
import { useAsyncData } from '../utils/fetch-loop';
import { SwapApiError, swapApiRequest } from '../utils/swap/api';
import { showSwapAddress } from '../utils/config';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  ConnectToMetamaskButton,
  useEthAccount,
  withdrawEth,
} from '../utils/swap/eth';
import { useSnackbar } from 'notistack';

export default function SendDialog({ open, onClose, publicKey, balanceInfo }) {
  const [tab, setTab] = useState(0);
  const onSubmitRef = useRef();

  const [swapCoinInfo] = useAsyncData(async () => {
    if (!showSwapAddress) {
      return null;
    }
    try {
      return await swapApiRequest(
        'GET',
        `coins/sol/${balanceInfo.mint?.toBase58()}`,
      );
    } catch (e) {
      if (e instanceof SwapApiError) {
        if (e.status === 404) {
          return null;
        }
      }
      throw e;
    }
  }, ['swapCoinInfo', balanceInfo.mint?.toBase58()]);
  const ethAccount = useEthAccount();

  const { mint, tokenName, tokenSymbol } = balanceInfo;

  return (
    <>
      <DialogForm
        open={open}
        onClose={onClose}
        onSubmit={() => onSubmitRef.current()}
      >
        <DialogTitle>
          Send {tokenName ?? abbreviateAddress(mint)}
          {tokenSymbol ? ` (${tokenSymbol})` : null}
        </DialogTitle>
        {swapCoinInfo ? (
          <Tabs
            value={tab}
            variant="fullWidth"
            onChange={(e, value) => setTab(value)}
          >
            <Tab label={`SPL ${swapCoinInfo.ticker}`} />
            <Tab label={describeSwap(swapCoinInfo)} />
          </Tabs>
        ) : null}
        {tab === 0 ? (
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
      </DialogForm>
      {ethAccount &&
      (swapCoinInfo?.blockchain === 'eth' || swapCoinInfo?.erc20Contract) ? (
        <EthWithdrawalCompleter ethAccount={ethAccount} publicKey={publicKey} />
      ) : null}
    </>
  );
}

function describeSwap(swapCoinInfo) {
  if (swapCoinInfo.blockchain === 'eth' && swapCoinInfo.erc20Contract) {
    return `ERC20 ${swapCoinInfo.ticker}`;
  }
  return `native ${swapCoinInfo.ticker}`;
}

function SendSplDialog({ onClose, publicKey, balanceInfo, onSubmitRef }) {
  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const { fields, destinationAddress, transferAmountString } = useForm(
    balanceInfo,
  );
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
      <DialogContent>{fields}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" color="primary" disabled={sending}>
          Send
        </Button>
      </DialogActions>
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
  const {
    fields,
    destinationAddress,
    transferAmountString,
    setDestinationAddress,
  } = useForm(balanceInfo);

  const { tokenName, decimals } = balanceInfo;
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
    return sendTransaction(makeTransaction(), { onSuccess: onClose });
  }
  onSubmitRef.current = onSubmit;

  return (
    <>
      <DialogContent>
        <DialogContentText>
          SPL {tokenName} can be converted to {describeSwap(swapCoinInfo)}
          {needMetamask ? ' via MetaMask' : null}.
        </DialogContentText>
        {needMetamask && !ethAccount ? <ConnectToMetamaskButton /> : fields}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          color="primary"
          disabled={sending || (needMetamask && !ethAccount)}
        >
          Send
        </Button>
      </DialogActions>
    </>
  );
}

function useForm(balanceInfo) {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [transferAmountString, setTransferAmountString] = useState('');
  const { amount: balanceAmount, decimals, tokenSymbol } = balanceInfo;

  const fields = (
    <>
      <TextField
        label="Recipient Address"
        fullWidth
        variant="outlined"
        margin="normal"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value.trim())}
      />
      <TextField
        label="Amount"
        fullWidth
        variant="outlined"
        margin="normal"
        type="number"
        InputProps={{
          endAdornment: tokenSymbol ? (
            <InputAdornment position="end">{tokenSymbol}</InputAdornment>
          ) : null,
          inputProps: {
            step: Math.pow(10, -decimals),
          },
        }}
        value={transferAmountString}
        onChange={(e) => setTransferAmountString(e.target.value.trim())}
        helperText={
          <span
            onClick={() =>
              setTransferAmountString(
                (balanceAmount / Math.pow(10, decimals)).toFixed(decimals),
              )
            }
          >
            Max: {balanceAmount / Math.pow(10, decimals)}
          </span>
        }
      />
    </>
  );

  return {
    fields,
    destinationAddress,
    transferAmountString,
    setDestinationAddress,
  };
}

function EthWithdrawalCompleter({ ethAccount, publicKey }) {
  const [swaps] = useAsyncData(
    () => swapApiRequest('GET', `swaps_from/sol/${publicKey.toBase58()}`),
    `swaps_from/sol/${publicKey.toBase58()}`,
    { refreshInterval: 10000 },
  );
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
  const { enqueueSnackbar } = useSnackbar();
  const { withdrawal } = swap;
  useEffect(() => {
    if (
      withdrawal.status === 'sent' &&
      withdrawal.blockchain === 'eth' &&
      withdrawal.txid &&
      !withdrawal.txid.startsWith('0x') &&
      withdrawal.txData
    ) {
      withdrawEth(ethAccount, withdrawal).catch((e) =>
        enqueueSnackbar(e.message, { variant: 'error' }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawal.txid, withdrawal.status]);
  return null;
}

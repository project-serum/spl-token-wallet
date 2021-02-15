import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogForm from './DialogForm';
import { useWallet, useWalletAddressForMint } from '../utils/wallet';
import { PublicKey } from '@solana/web3.js';
import { abbreviateAddress } from '../utils/utils';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useCallAsync, useSendTransaction } from '../utils/notifications';
import { swapApiRequest, useSwapApiGet } from '../utils/swap/api';
import { showSwapAddress } from '../utils/config';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  ConnectToMetamaskButton,
  useEthAccount,
  withdrawEth,
} from '../utils/swap/eth';
import { useConnection, useIsProdNetwork } from '../utils/connection';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { useAsyncData } from '../utils/fetch-loop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  TOKEN_PROGRAM_ID,
  WRAPPED_SOL_MINT,
} from '../utils/tokens/instructions';
import { parseTokenAccountData } from '../utils/tokens/data';

const WUSDC_MINT = new PublicKey(
  'BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW',
);
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

export default function SendDialog({ open, onClose, publicKey, balanceInfo }) {
  const isProdNetwork = useIsProdNetwork();
  const [tab, setTab] = useState('spl');
  const onSubmitRef = useRef();
  const { t } = useTranslation();

  const [swapCoinInfo] = useSwapApiGet(
    showSwapAddress && balanceInfo.mint && isProdNetwork
      ? `coins/sol/${balanceInfo.mint.toBase58()}`
      : null,
  );
  const ethAccount = useEthAccount();

  const { mint, tokenName, tokenSymbol } = balanceInfo;

  return (
    <>
      <DialogForm
        open={open}
        onClose={onClose}
        onSubmit={() => onSubmitRef.current()}
        fullWidth
      >
        <DialogTitle>
          {t("send_details", {tokenName: tokenName ?? abbreviateAddress(mint)})}
          {tokenSymbol ? ` (${tokenSymbol})` : null}
        </DialogTitle>
        {swapCoinInfo ? (
          <Tabs
            value={tab}
            variant="fullWidth"
            onChange={(e, value) => setTab(value)}
            textColor="primary"
            indicatorColor="primary"
          >
            {mint?.equals(WUSDC_MINT)
              ? [
                  <Tab label="SPL WUSDC" key="spl" value="spl" />,
                  <Tab
                    label="SPL USDC"
                    key="wusdcToSplUsdc"
                    value="wusdcToSplUsdc"
                  />,
                  <Tab label="ERC20 USDC" key="swap" value="swap" />,
                ]
              : [
                  <Tab
                    label={`SPL ${swapCoinInfo.ticker}`}
                    key="spl"
                    value="spl"
                  />,
                  <Tab
                    label={`${
                      swapCoinInfo.erc20Contract ? 'ERC20' : 'Native'
                    } ${swapCoinInfo.ticker}`}
                    key="swap"
                    value="swap"
                  />,
                ]}
          </Tabs>
        ) : null}
        {tab === 'spl' ? (
          <SendSplDialog
            onClose={onClose}
            publicKey={publicKey}
            balanceInfo={balanceInfo}
            onSubmitRef={onSubmitRef}
          />
        ) : tab === 'wusdcToSplUsdc' ? (
          <SendSwapDialog
            key={tab}
            onClose={onClose}
            publicKey={publicKey}
            balanceInfo={balanceInfo}
            swapCoinInfo={swapCoinInfo}
            onSubmitRef={onSubmitRef}
            wusdcToSplUsdc
          />
        ) : (
          <SendSwapDialog
            key={tab}
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

function SendSplDialog({ onClose, publicKey, balanceInfo, onSubmitRef }) {
  const { t } = useTranslation();
  const defaultAddressHelperText =
    !balanceInfo.mint || balanceInfo.mint.equals(WRAPPED_SOL_MINT)
      ? t("enter_solana_address")
      : t("enter_spl_or_solana_address");
  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const [addressHelperText, setAddressHelperText] = useState(
    defaultAddressHelperText,
  );
  const [passValidation, setPassValidation] = useState();
  const {
    fields,
    destinationAddress,
    transferAmountString,
    validAmount,
  } = useForm(balanceInfo, addressHelperText, passValidation);
  const { decimals, mint } = balanceInfo;
  const mintString = mint && mint.toBase58();

  useEffect(() => {
    (async () => {
      if (!destinationAddress) {
        setAddressHelperText(defaultAddressHelperText);
        setPassValidation(undefined);
        return;
      }
      try {
        const destinationAccountInfo = await wallet.connection.getAccountInfo(
          new PublicKey(destinationAddress),
        );

        if (destinationAccountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
          const accountInfo = parseTokenAccountData(
            destinationAccountInfo.data,
          );
          if (accountInfo.mint.toBase58() === mintString) {
            setPassValidation(true);
            setAddressHelperText(t("valid_spl_token_address"));
          } else {
            setPassValidation(false);
            setAddressHelperText(t("destination_address_not_match"));
          }
        } else {
          setPassValidation(true);
          setAddressHelperText(t("destination_address_solana"));
        }
      } catch (e) {
        console.log(`Received error validating address ${e}`);
        setAddressHelperText(defaultAddressHelperText);
        setPassValidation(undefined);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationAddress, wallet, mintString]);

  async function makeTransaction() {
    let amount = Math.round(parseFloat(transferAmountString) * 10 ** decimals);
    if (!amount || amount <= 0) {
      throw new Error(t('invalid_amount'));
    }
    return wallet.transferToken(
      publicKey,
      new PublicKey(destinationAddress),
      amount,
      balanceInfo.mint,
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
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button
          type="submit"
          color="primary"
          disabled={sending || !validAmount}
        >
          {t("send")}
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
  wusdcToSplUsdc = false,
  onSubmitRef,
}) {
  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const [signature, setSignature] = useState(null);
  const { t } = useTranslation();
  const {
    fields,
    destinationAddress,
    transferAmountString,
    setDestinationAddress,
    validAmount,
  } = useForm(balanceInfo);

  const { tokenName, decimals, mint } = balanceInfo;
  const blockchain = wusdcToSplUsdc
    ? 'sol'
    : swapCoinInfo.blockchain === 'sol'
    ? 'eth'
    : swapCoinInfo.blockchain;
  const needMetamask = blockchain === 'eth';

  useEffect(() => {
    if (blockchain === 'eth' && ethAccount) {
      setDestinationAddress(ethAccount);
    }
  }, [blockchain, ethAccount, setDestinationAddress]);

  let splUsdcWalletAddress = useWalletAddressForMint(
    wusdcToSplUsdc ? USDC_MINT : null,
  );
  useEffect(() => {
    if (wusdcToSplUsdc && splUsdcWalletAddress) {
      setDestinationAddress(splUsdcWalletAddress);
    }
  }, [setDestinationAddress, wusdcToSplUsdc, splUsdcWalletAddress]);

  async function makeTransaction() {
    let amount = Math.round(parseFloat(transferAmountString) * 10 ** decimals);
    if (!amount || amount <= 0) {
      throw new Error(t('invalid_amount'));
    }
    const params = {
      blockchain,
      address: destinationAddress,
      size: amount / 10 ** decimals,
    };
    if (blockchain === 'sol') {
      params.coin = swapCoinInfo.splMint;
    } else if (blockchain === 'eth') {
      params.coin = swapCoinInfo.erc20Contract;
    }
    if (mint?.equals(WUSDC_MINT)) {
      params.wusdcToUsdc = true;
    }
    const swapInfo = await swapApiRequest('POST', 'swap_to', params);
    if (swapInfo.blockchain !== 'sol') {
      throw new Error('Unexpected blockchain');
    }
    return wallet.transferToken(
      publicKey,
      new PublicKey(swapInfo.address),
      amount,
      balanceInfo.mint,
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
        blockchain={blockchain}
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <DialogContent style={{ paddingTop: 16 }}>
        <DialogContentText>
          SPL {tokenName} can be converted to{' '}
          {blockchain === 'eth' && swapCoinInfo.erc20Contract
            ? 'ERC20'
            : blockchain === 'sol' && swapCoinInfo.splMint
            ? 'SPL'
            : 'native'}{' '}
          {swapCoinInfo.ticker}
          {needMetamask ? ' via MetaMask' : null}.
        </DialogContentText>
        {needMetamask && !ethAccount ? <ConnectToMetamaskButton /> : fields}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button
          type="submit"
          color="primary"
          disabled={sending || (needMetamask && !ethAccount) || !validAmount}
        >
          {t("send")}
        </Button>
      </DialogActions>
    </>
  );
}

function SendSwapProgress({ publicKey, signature, onClose, blockchain }) {
  const connection = useConnection();
  const { t } = useTranslation();
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

  let step = 1;
  let ethTxid = null;
  for (let swap of swaps || []) {
    const { deposit, withdrawal } = swap;
    if (deposit.txid === signature) {
      if (withdrawal.txid?.startsWith('0x')) {
        step = 3;
        ethTxid = withdrawal.txid;
      } else if (withdrawal.txid && blockchain !== 'eth') {
        step = 3;
      } else {
        step = 2;
      }
    }
  }

  return (
    <>
      <DialogContent>
        <Stepper activeStep={step}>
          <Step>
            <StepLabel>{t("send_request")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t("wait_confirmations")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t("withdraw_funds")}</StepLabel>
          </Step>
        </Stepper>
        {ethTxid ? (
          <Typography variant="body2" align="center">
            <Link
              href={`https://etherscan.io/tx/${ethTxid}`}
              target="_blank"
              rel="noopener"
            >
              {t("view_etherscan")}
            </Link>
          </Typography>
        ) : step < 3 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ marginRight: 16 }}>
              <CircularProgress />
            </div>
            {confirms ? (
              <Typography>{t("confirmations", { confirms, total: 35 })}</Typography>
            ) : (
              <Typography>{t("transaction_pending")}</Typography>
            )}
          </div>
        ) : null}
        {!ethTxid && blockchain === 'eth' ? (
          <DialogContentText style={{ marginTop: 16, marginBottom: 0 }}>
            {t("keep_window_open")}
          </DialogContentText>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("close")}</Button>
      </DialogActions>
    </>
  );
}

function useForm(balanceInfo, addressHelperText, passAddressValidation) {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [transferAmountString, setTransferAmountString] = useState('');
  const { t } = useTranslation();
  const { amount: balanceAmount, decimals, tokenSymbol } = balanceInfo;

  const parsedAmount = parseFloat(transferAmountString) * 10 ** decimals;
  const validAmount = parsedAmount > 0 && parsedAmount <= balanceAmount;

  const fields = (
    <>
      <TextField
        label={t("recipient_address")}
        fullWidth
        variant="outlined"
        margin="normal"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value.trim())}
        helperText={addressHelperText}
        id={
          !passAddressValidation && passAddressValidation !== undefined
            ? 'outlined-error-helper-text'
            : undefined
        }
        error={!passAddressValidation && passAddressValidation !== undefined}
      />
      <TextField
        label={t("amount")}
        fullWidth
        variant="outlined"
        margin="normal"
        type="number"
        InputProps={{
          endAdornment:  (
            <InputAdornment position="end">
              <Button onClick={() =>
                setTransferAmountString(
                  balanceAmountToUserAmount(balanceAmount, decimals),
                )
              }>
                MAX
              </Button>
              {tokenSymbol ? tokenSymbol : null}
            </InputAdornment>
          ),
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
                balanceAmountToUserAmount(balanceAmount, decimals),
              )
            }
          >
            Max: {balanceAmountToUserAmount(balanceAmount, decimals)}
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
    validAmount,
  };
}

function balanceAmountToUserAmount(balanceAmount, decimals) {
  return (balanceAmount / Math.pow(10, decimals)).toFixed(decimals)
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

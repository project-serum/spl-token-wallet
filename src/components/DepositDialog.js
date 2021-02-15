import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogForm from './DialogForm';
import { abbreviateAddress } from '../utils/utils';
import CopyableDisplay from './CopyableDisplay';
import {
  useIsProdNetwork,
  useSolanaExplorerUrlSuffix,
} from '../utils/connection';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useAsyncData } from '../utils/fetch-loop';
import tuple from 'immutable-tuple';
import { showSwapAddress } from '../utils/config';
import { useCallAsync } from '../utils/notifications';
import { swapApiRequest } from '../utils/swap/api';
import {
  ConnectToMetamaskButton,
  getErc20Balance,
  swapErc20ToSpl,
  useEthAccount,
} from '../utils/swap/eth';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { DialogContentText } from '@material-ui/core';

export default function DepositDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  const isProdNetwork = useIsProdNetwork();
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const { mint, tokenName, tokenSymbol, owner } = balanceInfo;
  const [tab, setTab] = useState(0);
  const { t } = useTranslation();
  const [swapInfo] = useAsyncData(async () => {
    if (!showSwapAddress || !isProdNetwork) {
      return null;
    }
    return await swapApiRequest(
      'POST',
      'swap_to',
      {
        blockchain: 'sol',
        coin: balanceInfo.mint?.toBase58(),
        address: publicKey.toBase58(),
      },
      { ignoreUserErrors: true },
    );
  }, [
    'swapInfo',
    isProdNetwork,
    balanceInfo.mint?.toBase58(),
    publicKey.toBase58(),
  ]);

  let tabs = null;
  if (swapInfo) {
    let firstTab = `SPL ${tokenSymbol ?? swapInfo.coin.ticker}`;
    let secondTab = swapInfo.coin.ticker;
    if (!mint) {
      firstTab = 'SOL';
    } else {
      secondTab = `${
        swapInfo.coin.erc20Contract ? 'ERC20' : 'Native'
      } ${secondTab}`;
    }
    tabs = (
      <Tabs
        value={tab}
        variant="fullWidth"
        onChange={(e, value) => setTab(value)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label={firstTab} />
        <Tab label={secondTab} />
      </Tabs>
    );
  }

  return (
    <DialogForm open={open} onClose={onClose}>
      <DialogTitle>
        {t("deposit_details", { tokenName: tokenName ?? mint.toBase58() })}
        {tokenSymbol ? ` (${tokenSymbol})` : null}
      </DialogTitle>
      {tabs}
      <DialogContent style={{ paddingTop: 16 }}>
        {tab === 0 ? (
          <>
            {publicKey.equals(owner) ? (
              <DialogContentText>
                {t("sol_deposit_address")}
              </DialogContentText>
            ) : (
              <DialogContentText>
                {t("others_deposit_address", { tokenSymbol: tokenSymbol ?? abbreviateAddress(mint) })}
              </DialogContentText>
            )}
            <CopyableDisplay
              value={publicKey.toBase58()}
              label={t("deposit_address")}
              autoFocus
              qrCode
            />
            <DialogContentText variant="body2">
              <Link
                href={
                  `https://explorer.solana.com/account/${publicKey.toBase58()}` +
                  urlSuffix
                }
                target="_blank"
                rel="noopener"
              >
                {t("view_solana")}
              </Link>
            </DialogContentText>
          </>
        ) : (
          <SolletSwapDepositAddress
            balanceInfo={balanceInfo}
            swapInfo={swapInfo}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("close")}</Button>
      </DialogActions>
    </DialogForm>
  );
}

function SolletSwapDepositAddress({ balanceInfo, swapInfo }) {
  const { t } = useTranslation();    
  if (!swapInfo) {
    return null;
  }

  const { blockchain, address, memo, coin } = swapInfo;
  const { mint, tokenName } = balanceInfo;

  if (blockchain === 'btc' && memo === null) {
    return (
      <>
        <DialogContentText>
          {t("native_btc_conversion", { tokenName })}
        </DialogContentText>
        <CopyableDisplay
          value={address}
          label={t("native_btc_deposit_address")}
          autoFocus
          qrCode={`bitcoin:${address}`}
        />
      </>
    );
  }

  if (blockchain === 'eth') {
    return (
      <>
        <DialogContentText>
          {t("token_conversion_details", { type: coin.erc20Contract ? 'ERC20' : t("native"), ticker: coin.ticker, mint: mint ? "SPL" : t("native"), tokenName })}
        </DialogContentText>
        <MetamaskDeposit swapInfo={swapInfo} />
      </>
    );
  }

  return null;
}

function MetamaskDeposit({ swapInfo }) {
  const ethAccount = useEthAccount();
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null);
  const callAsync = useCallAsync();
  const { t } = useTranslation();

  const {
    address: swapAddress,
    memo: destination,
    coin: { erc20Contract: erc20Address, ticker },
  } = swapInfo;

  const [maxAmount, maxAmountLoaded] = useAsyncData(async () => {
    if (ethAccount) {
      return Math.min(
        await getErc20Balance(ethAccount, erc20Address),
        swapInfo.maxSize ?? Infinity,
      );
    }
    return 0;
  }, tuple(getErc20Balance, ethAccount, erc20Address));

  if (!ethAccount) {
    return <ConnectToMetamaskButton />;
  }

  async function submit() {
    setSubmitted(true);
    setStatus({ step: 0 });
    await callAsync(
      (async () => {
        let parsedAmount = parseFloat(amount);

        if (!parsedAmount || parsedAmount > maxAmount || parsedAmount <= 0) {
          throw new Error(t("invalid_amount"));
        }
        await swapErc20ToSpl({
          ethAccount,
          erc20Address,
          swapAddress,
          destination,
          amount,
          onStatusChange: (e) => setStatus((status) => ({ ...status, ...e })),
        });
      })(),
      { onError: () => setSubmitted(false) },
    );
  }

  if (!submitted) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <TextField
          label={t("amount")}
          fullWidth
          variant="outlined"
          margin="normal"
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{ticker}</InputAdornment>
            ),
            inputProps: {
              step: 'any',
            },
          }}
          value={amount}
          onChange={(e) => setAmount(e.target.value.trim())}
          helperText={
            maxAmountLoaded ? (
              <span onClick={() => setAmount(maxAmount.toFixed(6))}>
                Max: {maxAmount.toFixed(6)}
              </span>
            ) : null
          }
        />
        <Button color="primary" style={{ marginLeft: 8 }} onClick={submit}>
          {t("convert")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Stepper activeStep={status.step}>
        <Step>
          <StepLabel>{t("approve_conversion")}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t("send_funds")}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t("wait_confirmations")}</StepLabel>
        </Step>
      </Stepper>
      {status.step === 2 ? (
        <>
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
            <div>
              {status.confirms ? (
                <Typography>{t("confirmations", { confirms: status.confirms, total: 12 })}</Typography>
              ) : (
                <Typography>{t("transactions_pending")}</Typography>
              )}
              <Typography variant="body2">
                <Link
                  href={`https://etherscan.io/tx/${status.txid}`}
                  target="_blank"
                  rel="noopener"
                >
                  {t("view_etherscan")}
                </Link>
              </Typography>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

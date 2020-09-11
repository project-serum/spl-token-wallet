import React, { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogForm from './DialogForm';
import { abbreviateAddress } from '../utils/utils';
import CopyableDisplay from './CopyableDisplay';
import { useSolanaExplorerUrlSuffix } from '../utils/connection';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useAsyncData } from '../utils/fetch-loop';
import tuple from 'immutable-tuple';
import LoadingIndicator from './LoadingIndicator';
import Divider from '@material-ui/core/Divider';
import { showSwapAddress } from '../utils/config';
import { makeStyles } from '@material-ui/core/styles';
import { useCallAsync } from '../utils/notifications';
import { SwapApiError, swapApiRequest } from '../utils/swap/api';
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

export default function DepositDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  const urlSuffix = useSolanaExplorerUrlSuffix();
  let { mint, tokenName, tokenSymbol, owner } = balanceInfo;

  return (
    <DialogForm open={open} onClose={onClose}>
      <DialogTitle>
        Deposit {tokenName ?? mint.toBase58()}
        {tokenSymbol ? ` (${tokenSymbol})` : null}
      </DialogTitle>
      <DialogContent>
        {publicKey.equals(owner) ? (
          <Typography paragraph>
            This address can only be used to receive SOL. Do not send other
            tokens to this address.
          </Typography>
        ) : (
          <Typography paragraph>
            This address can only be used to receive{' '}
            {tokenSymbol ?? abbreviateAddress(mint)}. Do not send SOL to this
            address.
          </Typography>
        )}
        <CopyableDisplay
          value={publicKey.toBase58()}
          label={'Deposit Address'}
          autoFocus
          qrCode
        />
        <Typography variant="body2">
          <Link
            href={
              `https://explorer.solana.com/account/${publicKey.toBase58()}` +
              urlSuffix
            }
            target="_blank"
            rel="noopener"
          >
            View on Solana Explorer
          </Link>
        </Typography>
        {showSwapAddress ? (
          <SolletSwapDepositAddress
            publicKey={publicKey}
            balanceInfo={balanceInfo}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </DialogForm>
  );
}

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
  },
}));

function SolletSwapDepositAddress({ publicKey, balanceInfo }) {
  const classes = useStyles();
  const [swapInfo, loaded] = useAsyncData(async () => {
    try {
      return await swapApiRequest('POST', 'swap_to', {
        blockchain: 'sol',
        coin: balanceInfo.mint?.toBase58(),
        address: publicKey.toBase58(),
      });
    } catch (e) {
      if (e instanceof SwapApiError) {
        if (e.status === 404) {
          return null;
        }
      }
      throw e;
    }
  }, tuple('swapInfo', balanceInfo.mint?.toBase58(), publicKey.toBase58()));

  if (!loaded) {
    return <LoadingIndicator />;
  }

  if (!swapInfo) {
    return null;
  }

  const { blockchain, address, memo, coin } = swapInfo;
  const { tokenName } = balanceInfo;

  if (blockchain === 'btc' && memo === null) {
    return (
      <>
        <Divider className={classes.divider} />
        <Typography paragraph>
          Native BTC can be converted to SPL {tokenName} by sending it to the
          following address:
        </Typography>
        <CopyableDisplay
          value={address}
          label="Native BTC Deposit Address"
          qrCode={`bitcoin:${address}`}
        />
      </>
    );
  }

  if (blockchain === 'eth') {
    return (
      <>
        <Divider className={classes.divider} />
        <Typography gutterBottom>
          {coin.erc20Contract ? 'ERC20' : 'Native'} {coin.ticker} can be
          converted to SPL {tokenName} via MetaMask.
        </Typography>
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

  const {
    address: swapAddress,
    memo: destination,
    coin: { erc20Contract: erc20Address, ticker },
  } = swapInfo;

  const [maxAmount, maxAmountLoaded] = useAsyncData(() => {
    if (ethAccount) {
      return getErc20Balance(ethAccount, erc20Address);
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

        if (!parsedAmount || parsedAmount > maxAmount) {
          throw new Error('Invalid amount');
        }
        await swapErc20ToSpl({
          ethAccount,
          erc20Address,
          swapAddress,
          destination,
          amount: parsedAmount,
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
          label="Amount"
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
          Convert
        </Button>
      </div>
    );
  }

  return (
    <>
      <Stepper activeStep={status.step}>
        <Step>
          <StepLabel>Approve Conversion</StepLabel>
        </Step>
        <Step>
          <StepLabel>Send Funds</StepLabel>
        </Step>
        <Step>
          <StepLabel>Wait for Confirmations</StepLabel>
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
                <Typography>{status.confirms} / 12 Confirmations</Typography>
              ) : (
                <Typography>Transaction Pending</Typography>
              )}
              <Typography variant="body2">
                <Link
                  href={`https://etherscan.io/tx/${status.txid}`}
                  target="_blank"
                  rel="noopener"
                >
                  View on Etherscan
                </Link>
              </Typography>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

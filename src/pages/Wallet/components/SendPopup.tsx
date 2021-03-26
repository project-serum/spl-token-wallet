import React, { useEffect, useState } from 'react';
import DialogForm from './DialogForm';
import {
  useBalanceInfo,
  useWallet,
  useWalletAddressForMint,
} from '../../../utils/wallet';
import { PublicKey } from '@solana/web3.js';
import { useCallAsync, useSendTransaction } from '../../../utils/notifications';
import { swapApiRequest, useSwapApiGet } from '../../../utils/swap/api';
import { showSwapAddress } from '../../../utils/config';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  ConnectToMetamaskButton,
  // getErc20Balance,
  useEthAccount,
  withdrawEth,
} from '../../../utils/swap/eth';
import { useConnection, useIsProdNetwork } from '../../../utils/connection';
// import Link from '@material-ui/core/Link';
// import Typography from '@material-ui/core/Typography';
import { useAsyncData } from '../../../utils/fetch-loop';
// import CircularProgress from '@material-ui/core/CircularProgress';
import {
  TOKEN_PROGRAM_ID,
  WRAPPED_SOL_MINT,
} from '../../../utils/tokens/instructions';
import { parseTokenAccountData } from '../../../utils/tokens/data';
import { useTheme } from '@material-ui/core';
// import { EthFeeEstimate } from '../../../components/EthFeeEstimate';
import {
  RowContainer,
  StyledCheckbox,
  StyledLabel,
  Title,
  VioletButton,
  WhiteButton,
} from '../../commonStyles';
import { InputWithMax, InputWithPaste } from '../../../components/Input';
import AttentionComponent from '../../../components/Attention';
// import { StyledTab, StyledTabs } from '../styles';
import FakeInputs from '../../../components/FakeInputs';
import ProgressBar from '../../CreateWallet/components/ProgressBar';
import { StyledTab, StyledTabs } from '../styles';
import { useSnackbar } from 'notistack';
import { stripDigitPlaces } from '../../../utils/utils';

const WUSDC_MINT = new PublicKey(
  'BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW',
);
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

const WUSDT_MINT = new PublicKey(
  'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4',
);

const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');

const getTabs = (mint, swapCoinInfo, theme) => {
  if (mint?.equals(WUSDC_MINT)) {
    return [
      <StyledTab theme={theme} label="SPL WUSDC" key="spl" value="spl" />,
      <StyledTab
        theme={theme}
        label="SPL USDC"
        key="wusdcToSplUsdc"
        value="wusdcToSplUsdc"
      />,
      // <StyledTab label="ERC20 USDC" key="swap" value="swap" />,
    ];
  } else if (mint?.equals(WUSDT_MINT)) {
    return [
      <StyledTab theme={theme} label="SPL WUSDT" key="spl" value="spl" />,
      <StyledTab
        theme={theme}
        label="SPL USDT"
        key="wusdtToSplUsdt"
        value="wusdtToSplUsdt"
      />,
      // <StyledTab label="ERC20 USDT" key="swap" value="swap" />,
    ];
  } else {
    return [
      <StyledTab
        theme={theme}
        label={`SPL ${swapCoinInfo.ticker}`}
        key="spl"
        value="spl"
      />,
      // <StyledTab
      //   label={`${
      //     swapCoinInfo.erc20Contract ? 'ERC20' : 'Native'
      //   } ${swapCoinInfo.ticker}`}
      //   key="swap"
      //   value="swap"
      // />,
    ];
  }
};

export default function SendDialog({ open, onClose, publicKey }) {
  const balanceInfo = useBalanceInfo(publicKey) || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

  const isProdNetwork = useIsProdNetwork();
  const [tab, setTab] = useState('spl');

  const [swapCoinInfo] = useSwapApiGet(
    showSwapAddress && balanceInfo.mint && isProdNetwork
      ? `coins/sol/${balanceInfo.mint.toBase58()}`
      : null,
  );
  const ethAccount = useEthAccount();

  const { mint, tokenSymbol } = balanceInfo;
  const theme = useTheme();
  const tokenSymbolForCheck =
    tokenSymbol === 'wUSDT' || tokenSymbol === 'wUSDC'
      ? tokenSymbol.replace('w', 'Wrapped ')
      : tokenSymbol;

  return (
    <>
      <DialogForm
        open={open}
        theme={theme}
        onClose={onClose}
        onEnter={() => {
          setTab('spl');
        }}
        height={'auto'}
        padding={'2rem 0'}
      >
        <>
          <FakeInputs />
          <RowContainer>
            <Title fontSize="1.6rem">
              Send {tokenSymbolForCheck ? ` ${tokenSymbolForCheck} to` : null}
            </Title>
            {/* {ethAccount && (
              <div>
                <Typography color="textSecondary" style={{ fontSize: '14px' }}>
                  Metamask connected: {ethAccount}
                </Typography>
              </div>
            )} */}
          </RowContainer>
          {mint?.equals(WUSDC_MINT) || mint?.equals(WUSDT_MINT) ? (
            <StyledTabs
              value={tab}
              theme={theme}
              variant="fullWidth"
              onChange={(e, value) => setTab(value)}
              textColor="primary"
              indicatorColor="primary"
            >
              {getTabs(mint, swapCoinInfo, theme)}
            </StyledTabs>
          ) : null}
          {tab === 'spl' ? (
            <SendSplDialog
              onClose={onClose}
              publicKey={publicKey}
              balanceInfo={balanceInfo}
            />
          ) : tab === 'wusdcToSplUsdc' ? (
            <SendSwapDialog
              key={tab}
              ethAccount={''}
              tab={tab}
              onClose={onClose}
              publicKey={publicKey}
              balanceInfo={balanceInfo}
              swapCoinInfo={swapCoinInfo}
              wusdcToSplUsdc
            />
          ) : tab === 'wusdtToSplUsdt' ? (
            <SendSwapDialog
              key={tab}
              onClose={onClose}
              ethAccount={''}
              tab={tab}
              publicKey={publicKey}
              balanceInfo={balanceInfo}
              swapCoinInfo={swapCoinInfo}
              wusdtToSplUsdt
            />
          ) : (
            <SendSwapDialog
              key={tab}
              tab={tab}
              onClose={onClose}
              publicKey={publicKey}
              balanceInfo={balanceInfo}
              swapCoinInfo={swapCoinInfo}
              ethAccount={ethAccount}
            />
          )}
        </>
      </DialogForm>
      {ethAccount &&
      (swapCoinInfo?.blockchain === 'eth' || swapCoinInfo?.erc20Contract) ? (
        <EthWithdrawalCompleter ethAccount={ethAccount} publicKey={publicKey} />
      ) : null}
    </>
  );
}

function SendSplDialog({ onClose, publicKey, balanceInfo }) {
  const defaultAddressHelperText =
    !balanceInfo.mint || balanceInfo.mint.equals(WRAPPED_SOL_MINT)
      ? 'Enter Solana Address'
      : 'Enter SPL token or Solana address';

  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const [addressHelperText, setAddressHelperText] = useState(
    defaultAddressHelperText,
  );
  const [passValidation, setPassValidation] = useState<undefined | boolean>(
    undefined,
  );
  const [overrideDestinationCheck, setOverrideDestinationCheck] = useState(
    false,
  );
  const [shouldShowOverride, setShouldShowOverride] = useState<
    undefined | boolean
  >(undefined);
  const {
    fields,
    destinationAddress,
    transferAmountString,
    validAmount,
  } = useForm(balanceInfo, addressHelperText, passValidation, 'spl', false);
  const { decimals, mint } = balanceInfo;
  const mintString = mint && mint.toBase58();

  const theme = useTheme();

  useEffect(() => {
    (async () => {
      if (!destinationAddress) {
        setAddressHelperText(defaultAddressHelperText);
        setPassValidation(undefined);
        setShouldShowOverride(undefined);
        return;
      }
      try {
        const destinationAccountInfo = await wallet.connection.getAccountInfo(
          new PublicKey(destinationAddress),
        );
        setShouldShowOverride(false);

        if (destinationAccountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
          const accountInfo = parseTokenAccountData(
            destinationAccountInfo.data,
          );
          if (accountInfo.mint.toBase58() === mintString) {
            setPassValidation(true);
            setAddressHelperText('Address is a valid SPL token address');
          } else {
            setPassValidation(false);
            setAddressHelperText('Destination address mint does not match');
          }
        } else {
          setPassValidation(true);
          setAddressHelperText('Destination is a Solana address');
        }
      } catch (e) {
        console.log(`Received error validating address ${e}`);
        setAddressHelperText(defaultAddressHelperText);
        setShouldShowOverride(true);
        setPassValidation(undefined);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationAddress, wallet, mintString]);

  async function makeTransaction() {
    let amount = Math.round(parseFloat(transferAmountString) * 10 ** decimals);
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    return wallet.transferToken(
      publicKey,
      new PublicKey(destinationAddress),
      amount,
      balanceInfo.mint,
      null,
      overrideDestinationCheck,
    );
  }

  const disabled = shouldShowOverride
    ? !overrideDestinationCheck || sending || !validAmount
    : sending || !validAmount;

  async function onSubmit() {
    return (
      typeof sendTransaction === 'function' &&
      sendTransaction(makeTransaction(), {
        onSuccess: onClose,
        onError: () => {},
      })
    );
  }

  return (
    <>
      <RowContainer width="90%" direction="column">
        {fields}
        {shouldShowOverride && (
          <RowContainer
            margin={'0 0 2rem 0'}
            style={{
              alignItems: 'center',
              display: 'flex',
              textAlign: 'left',
            }}
          >
            <StyledLabel theme={theme} htmlFor={'overrideDestinationCheck'}>
              This address has no funds. Are you sure it's correct?
            </StyledLabel>
            <StyledCheckbox
              theme={theme}
              id={'overrideDestinationCheck'}
              checked={overrideDestinationCheck}
              onChange={() =>
                setOverrideDestinationCheck(!overrideDestinationCheck)
              }
            />
          </RowContainer>
        )}
        <RowContainer justify="space-between">
          <WhiteButton
            theme={theme}
            onClick={onClose}
            width="calc(50% - .5rem)"
          >
            Cancel
          </WhiteButton>
          <VioletButton
            theme={theme}
            type="submit"
            color="primary"
            width="calc(50% - .5rem)"
            disabled={!!disabled}
            onClick={onSubmit}
          >
            Send
          </VioletButton>
        </RowContainer>
      </RowContainer>
    </>
  );
}

function SendSwapDialog({
  tab,
  onClose,
  publicKey,
  balanceInfo,
  swapCoinInfo,
  ethAccount,
  wusdcToSplUsdc = false,
  wusdtToSplUsdt = false,
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
  } = useForm(balanceInfo, '', true, tab, swapCoinInfo?.erc20Contract);

  const theme = useTheme();

  const { tokenName, decimals, mint } = balanceInfo;
  const blockchain =
    wusdcToSplUsdc || wusdtToSplUsdt
      ? 'sol'
      : swapCoinInfo?.blockchain === 'sol'
      ? 'eth'
      : swapCoinInfo?.blockchain;
  const needMetamask = blockchain === 'eth';

  // const [ethBalance] = useAsyncData(
  //   () => getErc20Balance(ethAccount),
  //   'ethBalance',
  //   {
  //     refreshInterval: 2000,
  //   },
  // );

  // const ethFeeData = useSwapApiGet(
  //   blockchain === 'eth' &&
  //     `fees/eth/${ethAccount}` +
  //       (swapCoinInfo?.erc20Contract ? '/' + swapCoinInfo?.erc20Contract : ''),
  //   { refreshInterval: 2000 },
  // );
  // const [ethFeeEstimate] = ethFeeData;
  // const insufficientEthBalance =
  //   typeof ethBalance === 'number' &&
  //   typeof ethFeeEstimate === 'number' &&
  //   ethBalance < ethFeeEstimate;

  // useEffect(() => {
  //   if (blockchain === 'eth' && ethAccount) {
  //     setDestinationAddress(ethAccount);
  //   }
  // }, [blockchain, ethAccount, setDestinationAddress]);

  let splUsdcWalletAddress = useWalletAddressForMint(
    wusdcToSplUsdc ? USDC_MINT : null,
  );
  let splUsdtWalletAddress = useWalletAddressForMint(
    wusdtToSplUsdt ? USDT_MINT : null,
  );
  useEffect(() => {
    if (wusdcToSplUsdc && splUsdcWalletAddress) {
      setDestinationAddress(splUsdcWalletAddress);
    }
  }, [
    setDestinationAddress,
    wusdcToSplUsdc,
    splUsdcWalletAddress,
    wusdtToSplUsdt,
    splUsdtWalletAddress,
  ]);

  async function makeTransaction() {
    let amount = Math.round(parseFloat(transferAmountString) * 10 ** decimals);
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    const params: any = {
      blockchain,
      address: destinationAddress,
      size: amount / 10 ** decimals,
    };
    if (blockchain === 'sol') {
      params.coin = swapCoinInfo?.splMint;
    } else if (blockchain === 'eth') {
      params.coin = swapCoinInfo?.erc20Contract;
    }
    if (mint?.equals(WUSDC_MINT)) {
      params.wusdcToUsdc = true;
    } else if (mint?.equals(WUSDT_MINT)) {
      params.wusdtToUsdt = true;
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
    return (
      typeof sendTransaction === 'function' &&
      sendTransaction(makeTransaction(), {
        onSuccess: setSignature,
        onError: (e) => {
          console.log('error', e);
        },
      })
    );
  }

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

  let sendButton = (
    <VioletButton
      type="submit"
      color="primary"
      theme={theme}
      width="calc(50% - .5rem)"
      disabled={
        !!(
          (sending || (needMetamask && !ethAccount) || !validAmount)
          // || insufficientEthBalance
        )
      }
      onClick={onSubmit}
    >
      Send
    </VioletButton>
  );

  return (
    <>
      <RowContainer width="90%" direction="column" margin="2rem 0 0 0">
        <Title>
          SPL {tokenName} can be converted to{' '}
          {blockchain === 'eth' && swapCoinInfo?.erc20Contract
            ? 'ERC20'
            : blockchain === 'sol' && swapCoinInfo?.splMint
            ? 'SPL'
            : 'native'}{' '}
          {swapCoinInfo?.ticker}
          {needMetamask ? ' via MetaMask' : null}.
        </Title>
        {/* {blockchain === 'eth' && (
          <Title>
            Estimated withdrawal transaction fee:
            <EthFeeEstimate
              ethFeeData={ethFeeData}
              insufficientEthBalance={insufficientEthBalance}
            />
          </Title>
        )} */}
        {needMetamask && !ethAccount ? <ConnectToMetamaskButton /> : fields}
        {/* {insufficientEthBalance && (
          <RowContainer margin="2rem 0 0 0">
            <Title color={theme.customPalette.red.main}>
              Insufficient {swapCoinInfo?.ticker} for withdrawal transaction fee
            </Title>
          </RowContainer>
        )} */}
        <RowContainer
          justify="space-between"
          margin={
            !ethAccount &&
            // || insufficientEthBalance
            '2rem 0 0 0'
          }
        >
          <WhiteButton
            theme={theme}
            onClick={onClose}
            width="calc(50% - .5rem)"
          >
            Cancel
          </WhiteButton>
          {sendButton}
        </RowContainer>
      </RowContainer>
    </>
  );
}

function SendSwapProgress({ publicKey, signature, onClose, blockchain }) {
  const { enqueueSnackbar } = useSnackbar();

  const [showResult, setShowResult] = useState(false);
  const connection = useConnection();
  const theme = useTheme();
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
  useEffect(() => {
    if (showResult) {
      enqueueSnackbar('Success!', { variant: 'success' });
      onClose();
    }
  }, [showResult, enqueueSnackbar, onClose]);

  let step = 1;
  let ethTxid = null;
  for (let swap of swaps || []) {
    const { deposit, withdrawal } = swap;
    if (deposit.txid === signature) {
      if (withdrawal.txid?.startsWith('0x')) {
        step = 3;
        ethTxid = withdrawal.txid;
        setShowResult(true);
      } else if (withdrawal.txid && blockchain !== 'eth') {
        step = 3;
        setShowResult(true);
      } else {
        step = 2;
      }
    }
  }

  const stepToShow =
    confirms && confirms > 0 // we confirms - 2 step
      ? 2
      : confirms === null || step === 3 // null - done, show filled 3 step
      ? 4
      : step; // otherwise step 1

  return (
    <>
      <RowContainer direction="column">
        <ProgressBar
          currentStep={stepToShow}
          firstStepText={'Send Request'}
          secondStepText={
            confirms
              ? `Wait for Confirmations (${confirms}/35)`
              : 'Transaction Pending'
          }
          thirdStepText={'Withdraw Funds'}
          style={{ padding: '7rem 0 10rem 0' }}
        />
        {!ethTxid && blockchain === 'eth' ? (
          <DialogContentText style={{ marginTop: 16, marginBottom: 0 }}>
            Please keep this window open. You will need to approve the request
            on MetaMask to complete the transaction.
          </DialogContentText>
        ) : null}
        <WhiteButton
          theme={theme}
          onClick={onClose}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          Close Popup
          <span style={{ fontSize: '.9rem' }}>
            (the conversion process will not be stopped)
          </span>
        </WhiteButton>
      </RowContainer>
    </>
  );
}

function useForm(
  balanceInfo,
  addressHelperText = '',
  passAddressValidation = true,
  tab = 'spl',
  erc20Contract = true,
) {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [transferAmountString, setTransferAmountString] = useState('');
  const { amount: balanceAmount, decimals, tokenSymbol } = balanceInfo;

  const parsedAmount = parseFloat(transferAmountString) * 10 ** decimals;
  const validAmount = parsedAmount > 0 && parsedAmount <= balanceAmount;
  const theme = useTheme();
  const tokenSymbolForCheck =
    tokenSymbol === 'wUSDT' || tokenSymbol === 'wUSDC'
      ? tokenSymbol.replace('w', 'Wrapped ')
      : tokenSymbol;

  const isConvertTab = tab === 'wusdcToSplUsdc' || tab === 'wusdtToSplUsdt';
  let maxBalance = String(
    stripDigitPlaces(balanceAmountToUserAmount(balanceAmount, decimals), 8),
  );

  // minus fee for transfering
  if (tokenSymbol === 'SOL') {
    maxBalance = String(
      stripDigitPlaces(parseFloat(String(maxBalance)) - 0.000005, 8),
    );
  }

  const fields = (
    <>
      <RowContainer margin="2rem 0">
        <InputWithPaste
          placeholder="Recipient Address"
          type="text"
          style={{ fontSize: '1.2rem' }}
          containerStyle={{ width: '100%' }}
          onChange={(e) => setDestinationAddress(e.target.value)}
          value={destinationAddress}
          onPasteClick={() =>
            navigator.clipboard
              .readText()
              .then((clipText) => setDestinationAddress(clipText))
          }
        />
      </RowContainer>

      {!passAddressValidation && (
        <RowContainer margin="0 0 2rem 0">
          <Title fontSize="1.4rem" color={theme.customPalette.red.main}>
            {addressHelperText}
          </Title>
        </RowContainer>
      )}

      <RowContainer>
        <AttentionComponent
          blockHeight="8rem"
          iconStyle={{ margin: '0 2rem 0 3rem' }}
          textStyle={{
            fontSize: '1.4rem',
          }}
          text={`Please make sure that you sending funds to the ${
            isConvertTab
              ? ` Native ${tokenSymbol.replace('w', '')}`
              : tokenSymbolForCheck
          } address in the ${
            tab === 'spl' ? 'SPL' : erc20Contract ? 'ERC20' : 'Native'
          } network.`}
        />
      </RowContainer>

      <RowContainer margin="2rem 0">
        <InputWithMax
          placeholder="Amount"
          type="text"
          containerStyle={{ width: '100%' }}
          onChange={(e) => setTransferAmountString(e.target.value)}
          value={transferAmountString}
          onMaxClick={() => setTransferAmountString(maxBalance)}
          maxText={`${maxBalance} ${tokenSymbol ? tokenSymbolForCheck : null}`}
        />
      </RowContainer>
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
  return (balanceAmount / Math.pow(10, decimals)).toFixed(decimals);
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

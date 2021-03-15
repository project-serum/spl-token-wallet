import React, { useState } from 'react';
import DialogForm from './DialogForm';
import {
  useIsProdNetwork,
  useSolanaExplorerUrlSuffix,
} from '../../../utils/connection';
import { useAsyncData } from '../../../utils/fetch-loop';
import { abbreviateAddress } from '../../../utils/utils';
import tuple from 'immutable-tuple';
import { useCallAsync } from '../../../utils/notifications';
import {
  ConnectToMetamaskButton,
  getErc20Balance,
  swapErc20ToSpl,
  useEthAccount,
  estimateErc20SwapFees,
} from '../../../utils/swap/eth';
import { showSwapAddress } from '../../../utils/config';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import { useTheme } from '@material-ui/core';
import { EthFeeEstimate } from '../../../components/EthFeeEstimate';
import { useBalanceInfo } from '../../../utils/wallet';
import { swapApiRequest } from '../../../utils/swap/api';
import {
  RowContainer,
  Title,
  VioletButton,
  WhiteButton,
} from '../../commonStyles';
import { InputWithMax, TextareaWithCopy } from '../../../components/Input';
import AttentionComponent from '../../../components/Attention';
import { StyledTab, StyledTabs, StyledStepLabel } from '../styles';

import MetamaskIcon from '../../../images/metamask.png';

export default function DepositDialog({ open, onClose, publicKey }) {
  const balanceInfo = useBalanceInfo(publicKey) || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
    owner: '',
  };
  const isProdNetwork = useIsProdNetwork();
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
        address: publicKey?.toBase58(),
      },
      { ignoreUserErrors: true },
    );
  }, [
    'swapInfo',
    isProdNetwork,
    balanceInfo.mint?.toBase58(),
    publicKey?.toBase58(),
  ]);

  const ethAccount = useEthAccount();
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const { mint, tokenSymbol, owner } = balanceInfo;
  const [tab, setTab] = useState(0);
  const theme = useTheme();

  let firstTab;
  let secondTab;

  if (swapInfo) {
    firstTab = `Deposit SPL ${tokenSymbol ?? swapInfo.coin.ticker}`;
    secondTab = !mint
      ? `Deposit ${swapInfo.coin.ticker} to SOL`
      : swapInfo.coin.ticker;
    if (!mint) {
      firstTab = 'Deposit SOL';
    } else {
      secondTab = ` Convert ${
        swapInfo.coin.erc20Contract ? 'ERC20' : 'Native'
      } ${secondTab} to SOL`;
    }
  }

  return (
    <DialogForm
      open={open}
      onClose={onClose}
      height={
        tab === 0 ? '45rem' : swapInfo?.blockchain === 'btc' ? '30rem' : '50rem'
      }
    >
      {swapInfo && (
        <RowContainer padding="1.6rem 0 2.4rem 0">
          <StyledTabs
            theme={theme}
            value={tab}
            variant="fullWidth"
            onChange={(e, value) => setTab(value)}
          >
            <StyledTab theme={theme} label={firstTab} />
            <StyledTab theme={theme} label={secondTab} />
          </StyledTabs>
        </RowContainer>
      )}
      <RowContainer direction="column" padding="0">
        {tab === 0 ? (
          <>
            <RowContainer width="90%">
              {/* TODO: add qr code */}
              {/* <CopyableDisplay
              value={publicKey?.toBase58()}
              label={'Deposit Address'}
              autoFocus
              qrCode
            /> */}
              <TextareaWithCopy value={publicKey?.toBase58()} height={'5rem'} />
            </RowContainer>
            <RowContainer
              width="90%"
              justify="flex-start"
              padding="1rem 0 0 1.6rem"
            >
              <Link
                href={
                  `https://explorer.solana.com/account/${publicKey?.toBase58()}` +
                  urlSuffix
                }
                target="_blank"
                rel="noopener"
                style={{
                  color: theme.customPalette.blue.serum,
                  fontSize: '1rem',
                  fontFamily: 'Avenir Next Demi',
                }}
              >
                View on Solana Explorer
              </Link>
            </RowContainer>
            <RowContainer width="90%" padding="2rem 0">
              <AttentionComponent
                text={
                  publicKey?.equals(owner)
                    ? 'This address can only be used to receive SOL. Do not send other tokens to this address.'
                    : `This address can only be used to receive ${
                        tokenSymbol ?? abbreviateAddress(mint)
                      }. Do not send SOL to this address.`
                }
                blockHeight={'8rem'}
                iconStyle={{ margin: '0 2rem 0 3rem' }}
                textStyle={{
                  color: theme.customPalette.orange.light,
                  fontSize: '1.4rem',
                  fontFamily: 'Avenir Next',
                }}
              />
            </RowContainer>
          </>
        ) : (
          <SolletSwapDepositAddress
            balanceInfo={balanceInfo}
            swapInfo={swapInfo}
            ethAccount={ethAccount}
            onClose={onClose}
          />
        )}
      </RowContainer>
      {
        (tab === 0 && (
          <RowContainer margin="2rem 0 0 0">
            <WhiteButton theme={theme} width={'calc(50%)'} onClick={onClose}>
              Close
            </WhiteButton>
          </RowContainer>
        ))}
    </DialogForm>
  );
}

function SolletSwapDepositAddress({
  balanceInfo,
  swapInfo,
  ethAccount,
  onClose,
}) {
  const [ethBalance] = useAsyncData(
    () => getErc20Balance(ethAccount),
    'ethBalance',
    {
      refreshInterval: 2000,
    },
  );

  const ethFeeData = useAsyncData(
    swapInfo?.coin &&
      (() =>
        estimateErc20SwapFees({
          erc20Address: swapInfo.coin.erc20Contract,
          swapAddress: swapInfo.address,
          ethAccount,
        })),
    'depositEthFee',
    {
      refreshInterval: 2000,
    },
  );

  if (!swapInfo) {
    return null;
  }

  const ethFeeEstimate = Array.isArray(ethFeeData[0])
    ? ethFeeData[0].reduce((acc, elem) => acc + elem)
    : ethFeeData[0];
  const insufficientEthBalance =
    typeof ethBalance === 'number' &&
    typeof ethFeeEstimate === 'number' &&
    ethBalance < ethFeeEstimate;

  const { blockchain, address, memo, coin } = swapInfo;
  const { mint, tokenName } = balanceInfo;

  if (blockchain === 'btc' && memo === null) {
    return (
      <RowContainer direction="column" width="90%">
        <Title style={{ marginBottom: '2rem' }}>
          Native BTC can be converted to SPL {tokenName} by sending it to the
          following address:
        </Title>
        <TextareaWithCopy
          value={address}
          height="5rem"
          // qrCode={`bitcoin:${address}`}
        />
      </RowContainer>
    );
  }

  if (blockchain === 'eth') {
    return (
      <RowContainer direction="column">
        <Title fontSize="1.4rem" fontFamily="Avenir Next Demi">
          {coin.erc20Contract ? 'ERC20' : 'Native'} {coin.ticker} can be
          converted to {mint ? 'SPL' : 'native'} {tokenName} via MetaMask.
        </Title>
        {!ethAccount && (
          <Title
            fontSize="1.4rem"
            fontFamily="Avenir Next Demi"
            style={{ padding: '1rem 0' }}
          >
            To convert, you must already have SOL in your wallet
          </Title>
        )}
        <RowContainer>
          <Title fontSize="1.4rem" fontFamily="Avenir Next Demi">
            Estimated withdrawal transaction fee: {'  '}
            <EthFeeEstimate
              ethFeeData={ethFeeData}
              insufficientEthBalance={insufficientEthBalance}
            />
          </Title>
        </RowContainer>
        {!ethAccount && (
          <RowContainer margin="2rem 0">
            <img src={MetamaskIcon} alt="metamask" />
          </RowContainer>
        )}
        <MetamaskDeposit
          swapInfo={swapInfo}
          onClose={onClose}
          insufficientEthBalance={insufficientEthBalance}
        />
      </RowContainer>
    );
  }

  return null;
}

function MetamaskDeposit({ swapInfo, insufficientEthBalance, onClose }) {
  const ethAccount = useEthAccount();
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<{
    step: number;
    confirms: number;
    txid: string;
  }>({ step: 0, confirms: 0, txid: '' });
  const callAsync = useCallAsync();
  const theme = useTheme();

  const {
    address: swapAddress,
    memo: destination,
    coin: { erc20Contract: erc20Address },
  } = swapInfo;

  const [maxAmount] = useAsyncData(async () => {
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
    setStatus({ step: 0, confirms: 0, txid: '' });
    await callAsync(
      (async () => {
        let parsedAmount = parseFloat(amount);

        if (
          !parsedAmount ||
          parsedAmount > Number(maxAmount) ||
          parsedAmount <= 0
        ) {
          throw new Error('Invalid amount');
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
      { onError: () => setSubmitted(false), onSuccess: () => {} },
    );
  }

  if (!submitted) {
    let convertButton = (
      <VioletButton
        theme={theme}
        width={'calc(50% - .5rem)'}
        onClick={submit}
        disabled={insufficientEthBalance}
      >
        Convert
      </VioletButton>
    );

    // if (insufficientEthBalance) {
    //   convertButton = (
    //     <Tooltip
    //       title="Insufficient ETH for withdrawal transaction fee"
    //       placement="top"
    //     >
    //       <span>{convertButton}</span>
    //     </Tooltip>
    //   );
    // }

    return (
      <>
        <RowContainer margin="1rem 0">
          {ethAccount && (
            <>
              <Title color={theme.customPalette.grey.dark} fontSize="1.2rem">
                <span style={{ fontFamily: 'Avenir Next Demi' }}>
                  Metamask connected:
                </span>{' '}
                {ethAccount}
              </Title>
            </>
          )}
        </RowContainer>
        <RowContainer width="90%" padding="2rem 0">
          <AttentionComponent
            text={
              `To convert ${swapInfo?.coin?.ticker} to SOL , your  SOL balance shouldn’t be empty.`
            }
            blockHeight={'4rem'}
            iconStyle={{ margin: '0 2rem 0 3rem', height: '2.5rem' }}
            textStyle={{
              fontSize: '1.2rem',
            }}
          />
        </RowContainer>
        <InputWithMax
          value={amount}
          maxText={`${Number(maxAmount).toFixed(6)} ${swapInfo?.coin?.ticker}`}
          onChange={(e) => setAmount(e.target.value.trim())}
          onMaxClick={() => setAmount(Number(maxAmount).toFixed(6))}
          placeholder={'Amount'}
          type={'text'}
        />
        {insufficientEthBalance && (
          <RowContainer width="90%" margin="2rem 0 0 0">
            <Title color={theme.customPalette.red.main}>
              Insufficient {swapInfo?.coin?.ticker} for withdrawal transaction fee
            </Title>
          </RowContainer>
        )}
        <RowContainer justify="space-between" width="90%" margin="2rem 0 0 0">
          <WhiteButton
            theme={theme}
            onClick={onClose}
            width="calc(50% - .5rem)"
          >
            Close
          </WhiteButton>
          {convertButton}
        </RowContainer>
      </>
    );
  }

  return (
    <>
      <Stepper
        activeStep={status.step}
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '1.4rem',
          alignItems: 'flex-start',
        }}
      >
        <Step style={{ margin: '1rem 0', fontSize: '1.4rem' }}>
          <StyledStepLabel>Approve Conversion</StyledStepLabel>
        </Step>
        <Step style={{ margin: '1rem 0' }}>
          <StyledStepLabel>Send Funds</StyledStepLabel>
        </Step>
        <Step style={{ margin: '1rem 0' }}>
          <StyledStepLabel>Wait for Confirmations</StyledStepLabel>
        </Step>
      </Stepper>
      {status.step === 2 ? (
        <>
          <RowContainer margin="2rem 0 0 0">
            <div style={{ marginRight: 16 }}>
              <CircularProgress />
            </div>
            <div>
              {status.confirms ? (
                <Title>{status.confirms} / 12 Confirmations</Title>
              ) : (
                <Title>Transaction Pending</Title>
              )}
              <Title style={{ marginLeft: '2rem' }}>
                <Link
                  href={`https://etherscan.io/tx/${status.txid}`}
                  target="_blank"
                  rel="noopener"
                >
                  View on Etherscan
                </Link>
              </Title>
            </div>
          </RowContainer>
        </>
      ) : null}
    </>
  );
}

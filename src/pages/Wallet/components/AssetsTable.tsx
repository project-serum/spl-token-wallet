import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Theme, useTheme } from '@material-ui/core';
import { PublicKey } from '@solana/web3.js';

import { Row, RowContainer, Title, VioletButton } from '../../commonStyles';

import TokenIcon from '../../../components/TokenIcon';
import { useWallet } from '../../../utils/wallet';

import { useSolanaExplorerUrlSuffix } from '../../../utils/connection';
import {
  formatNumberToUSFormat,
  isUSDToken,
  stripDigitPlaces,
  TokenInfo,
} from '../../../utils/utils';
import { BtnCustom } from '../../../components/BtnCustom';

import AddIcon from '../../../images/addIcon.svg';
import Dots from '../../../images/Dots.svg';
import RefreshIcon from '../../../images/refresh.svg';
import ReceiveIcon from '../../../images/receive.svg';
import SendIcon from '../../../images/send.svg';
import ExplorerIcon from '../../../images/explorer.svg';
import ActivitiesDropdown from './ActivitiesDropdown';
import { findAssociatedTokenAddress } from '../../../utils/tokens';
// import { CCAI_MINT } from '../../../utils/tokens/instructions';
import { Loading } from '../../../components/Loading';
// import { MASTER_BUILD } from '../../../utils/config';

export const TableContainer = styled(({ theme, isActive, ...props }) => (
  <Row {...props} />
))`
  background: ${(props) => props.theme.customPalette.grey.background};
  border: ${(props) => props.theme.customPalette.border.new};
  border-radius: 1.2rem;
  height: 100%;

  @media (max-width: 540px) {
    height: calc(100% - 4rem);
    background: none;
    border: none;
    border-radius: none;
    width: 100%;
    display: ${(props) => (props.isActive ? 'block' : 'none')};
  }
`;

const StyledTable = styled.table`
  width: calc(100% - 4.8rem);
  margin: 0 2.4rem;
  border-spacing: 0;

  & tr td:first-child {
    border-bottom-left-radius: 1.2rem;
    border-top-left-radius: 1.2rem;
  }

  & tr td:last-child {
    border-top-right-radius: 1.2rem;
    border-bottom-right-radius: 1.2rem;
  }

  & tr td:first-child {
    padding-left: 2.4rem;
  }

  & tr td:last-child {
    padding-right: 2.4rem;
  }

  @media (max-width: 540px) {
    margin: 0;
    width: calc(100%);
  }
`;

export const HeadRow = styled(Row)`
  text-align: right;
  width: 10%;
  border-bottom: ${(props) => props.theme.customPalette.border.new};
`;

const RefreshButton = styled(BtnCustom)`
  @media (max-width: 540px) {
    display: none;
  }
`;

const AddTokenStyledButton = styled(BtnCustom)`
  @media (max-width: 540px) {
    border: 0.1rem solid #f5fbfb;
    background: transparent;
    border-radius: 4rem;
    height: 6rem;
    width: 100%;
    span {
      color: #f5fbfb;
    }
  }
`;

const ImgContainer = styled.img`
  @media (max-width: 540px) {
    display: none;
  }
`;

const AddTokenButtonContainer = styled(RowContainer)`
  @media (max-width: 540px) {
    display: none;
  }
`;

const AddTokenButton = ({
  theme,
  setShowAddTokenDialog,
}: {
  theme: Theme;
  setShowAddTokenDialog: (isOpen: boolean) => void;
}) => {
  return (
    <AddTokenStyledButton
      textTransform={'capitalize'}
      borderWidth="0"
      height={'100%'}
      padding={'1.2rem 0'}
      onClick={() => setShowAddTokenDialog(true)}
    >
      <ImgContainer
        src={AddIcon}
        alt="addIcon"
        style={{ marginRight: '1rem' }}
      />
      <GreyTitle theme={theme}>Add token</GreyTitle>
    </AddTokenStyledButton>
  );
};

export const GreyTitle = styled(({ theme, ...props }) => (
  <Title
    color={theme.customPalette.grey.light}
    fontFamily="Avenir Next Demi"
    fontSize="1.4rem"
    {...props}
  />
))`
  white-space: nowrap;
`;

const StyledTr = styled.tr`
  height: 7rem;

  &:nth-child(2n) td {
    background: ${(props) =>
      props.disableHover ? '' : props.theme.customPalette.dark.background};
  }

  @media (max-width: 540px) {
    height: 9rem;

    td {
      display: none;
    }

    td:first-child,
    td:last-child {
      display: table-cell;
    }
  }

  @media (min-width: 540px) {
    &:not(:last-child) td:last-child {
      display: none;
    }
  }
`;

const StyledTd = styled.td`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const StyledTdMenu = styled(StyledTd)`
  position: relative;
`;

const DropdownContainer = styled.div`
  height: auto;
  width: 40%;
  padding-left: 60%;

  &:hover div {
    display: flex;
  }
`;

const AssetSymbol = styled(Title)`
  font-size: 2rem;
  font-family: Avenir Next Demi;
`;

const AssetName = styled(Title)`
  color: ${(props) => props.theme.customPalette.grey.light};
  font-size: 1.4rem;
  font-family: Avenir Next;
  margin-left: 0.5rem;
  width: 3rem;
  white-space: nowrap;
`;

const AssetAmount = styled(Title)`
  color: ${(props) => props.theme.customPalette.green.light};
  font-size: 1.4rem;
  font-family: Avenir Next;
  @media (max-width: 540px) {
    font-size: 2rem;
  }
`;

const AssetAmountUSD = styled(AssetAmount)`
  font-family: Avenir Next Demi;
  color: #fff;
`;

const MainHeaderRow = styled(RowContainer)`
  height: 5rem;
  @media (max-width: 540px) {
    display: none;
  }
`;

const ValuesContainerForExtension = styled(RowContainer)`
  display: none;
  @media (max-width: 540px) {
    display: flex;
    justify-content: flex-start;
  }
`;
const ValuesContainer = styled(RowContainer)`
  justify-content: flex-start;
  @media (max-width: 540px) {
    display: none;
  }
`;

const AddTokenBtnRow = styled(RowContainer)`
  width: 14rem;
  justify-content: flex-start;
  height: 5rem;
  padding-left: 2rem;
  @media (max-width: 540px) {
    width: 90%;
    justify-content: center;
    height: 6rem;
    padding-left: 0;
    margin: 0 auto;
  }
`;

const LastStyledTd = styled(StyledTd)`
  padding-left: 0;
  @media (max-width: 540px) {
    width: 100%;
  }
`;

// Calculating associated token addresses is an asynchronous operation, so we cache
// the values so that we can quickly render components using them. This prevents
// flickering for the associated token fingerprint icon.
export const associatedTokensCache = {};

const AssetsTable = ({
  isActive,
  allTokensData,
  tokensData,
  refreshTokensData,
  selectToken,
  setSendDialogOpen,
  setDepositDialogOpen,
  setShowAddTokenDialog,
  setCloseTokenAccountDialogOpen,
}: {
  isActive?: boolean;
  allTokensData: Map<string, TokenInfo>;
  tokensData: Map<string, number>;
  refreshTokensData: () => void;
  selectToken: ({
    publicKey,
    isAssociatedToken,
  }: {
    publicKey: PublicKey;
    isAssociatedToken: boolean;
  }) => void;
  setSendDialogOpen: (isOpen: boolean) => void;
  setDepositDialogOpen: (isOpen: boolean) => void;
  setShowAddTokenDialog: (isOpen: boolean) => void;
  setCloseTokenAccountDialogOpen: (isOpen: boolean) => void;
}) => {
  const theme = useTheme();
  const wallet = useWallet();
  const walletPubkey = wallet?.publicKey?.toString();

  const sortedPublicKeys = useMemo(
    () =>
      [...allTokensData.values()].sort((tokenA, tokenB) => {
        if ((!tokenA && !tokenB) || !walletPubkey) return 0;
        if (!tokenA) return 1;
        if (!tokenB) return -1;

        const isTokenAUSDT = isUSDToken(tokenA.symbol);
        const isTokenBUSDT = isUSDToken(tokenB.symbol);

        let tokenAPrice = tokensData.get(`${tokenA.symbol}`) || 0;
        if (isTokenAUSDT) tokenAPrice = 1;
        let tokenBPrice = tokensData.get(`${tokenB.symbol}`) || 0;
        if (isTokenBUSDT) tokenBPrice = 1;

        const aVal = tokenA.amount * tokenAPrice;
        const bVal = tokenB.amount * tokenBPrice;

        // SOL always fisrt
        if (new PublicKey(tokenA.address).equals(new PublicKey(walletPubkey)))
          return -1;
        if (new PublicKey(tokenB.address).equals(new PublicKey(walletPubkey)))
          return 1;

        // CCAI always second
        // if (new PublicKey(tokenA.mint).equals(CCAI_MINT)) return -1;
        // if (new PublicKey(tokenB.mint).equals(CCAI_MINT)) return 1;

        const totalA = aVal === undefined || aVal === null ? -1 : aVal;
        const totalB = bVal === undefined || bVal === null ? -1 : bVal;

        if (totalB < totalA) {
          return -1;
        } else if (totalB > totalA) {
          return 1;
        } else {
          return tokenA.symbol.localeCompare(tokenB.symbol);
        }
      }),
    [allTokensData, walletPubkey, tokensData],
  );

  return (
    <TableContainer
      theme={theme}
      width="calc(85% - 1rem)"
      direction="column"
      justify={'flex-start'}
      isActive={isActive}
    >
      <MainHeaderRow theme={theme}>
        <HeadRow
          theme={theme}
          justify="flex-start"
          style={{ width: '80%', padding: '1.4rem 0 1.4rem 2.4rem' }}
        >
          <GreyTitle theme={theme}>Assets</GreyTitle>
        </HeadRow>
        <HeadRow theme={theme}>
          <AddTokenButtonContainer>
            <AddTokenButton
              setShowAddTokenDialog={setShowAddTokenDialog}
              theme={theme}
            />
          </AddTokenButtonContainer>
        </HeadRow>
        <HeadRow theme={theme}>
          <RefreshButton
            textTransform={'capitalize'}
            borderWidth="0"
            height={'100%'}
            padding={'1.2rem 0'}
            onClick={refreshTokensData}
          >
            <img
              src={RefreshIcon}
              alt="refreshIcon"
              style={{ marginRight: '1rem' }}
            />
            <GreyTitle theme={theme}>Refresh</GreyTitle>
          </RefreshButton>
        </HeadRow>
      </MainHeaderRow>
      <RowContainer
        style={{ display: 'block', overflowY: 'auto' }}
        height="calc(100% - 5rem)"
      >
        <StyledTable theme={theme}>
          <tbody>
            {sortedPublicKeys.map((balanceInfo, i) => (
              <AssetItem
                key={`${balanceInfo.address}-${i}-table`}
                publicKey={new PublicKey(balanceInfo.address)}
                theme={theme}
                tokensData={tokensData}
                balanceInfo={balanceInfo}
                selectToken={selectToken}
                setSendDialogOpen={setSendDialogOpen}
                setDepositDialogOpen={setDepositDialogOpen}
                setCloseTokenAccountDialogOpen={setCloseTokenAccountDialogOpen}
              />
            ))}
            {sortedPublicKeys.length === 0 && (
              <Loading
                color={'#651CE4'}
                style={{ padding: '2rem 0 2rem 4.8rem' }}
              />
            )}
            <StyledTr disableHover theme={theme} style={{ width: '100%' }}>
              <LastStyledTd colSpan={2}>
                <AddTokenBtnRow>
                  <AddTokenButton
                    setShowAddTokenDialog={setShowAddTokenDialog}
                    theme={theme}
                  />
                </AddTokenBtnRow>
              </LastStyledTd>
            </StyledTr>
          </tbody>
        </StyledTable>
      </RowContainer>
    </TableContainer>
  );
};

const AssetItem = ({
  theme,
  publicKey,
  selectToken,
  setSendDialogOpen,
  setDepositDialogOpen,
  setCloseTokenAccountDialogOpen,
  tokensData = new Map(),
  balanceInfo,
}: {
  publicKey: PublicKey;
  theme: Theme;
  tokensData: Map<string, number>;
  balanceInfo?: TokenInfo;
  selectToken: ({
    publicKey,
    isAssociatedToken,
  }: {
    publicKey: PublicKey;
    isAssociatedToken: boolean;
  }) => void;
  setSendDialogOpen: (isOpen: boolean) => void;
  setDepositDialogOpen: (isOpen: boolean) => void;
  setCloseTokenAccountDialogOpen: (isOpen: boolean) => void;
}) => {
  const wallet = useWallet();
  const urlSuffix = useSolanaExplorerUrlSuffix();

  let {
    amount,
    mint,
    name: tokenName,
    symbol: tokenSymbol,
    tokenLogoUri,
  } = balanceInfo || {
    amount: 0,
    mint: '',
    name: 'Loading...',
    symbol: '--',
    tokenLogoUri: undefined,
  };

  if (tokenSymbol === 'CCAI') {
    tokenSymbol = 'RIN';
  }

  if (tokenName === 'Cryptocurrencies.Ai') {
    tokenName = 'Aldrin';
  }

  // Fetch and cache the associated token address.
  if (wallet && wallet.publicKey && mint) {
    if (
      associatedTokensCache[wallet.publicKey.toString()] === undefined ||
      associatedTokensCache[wallet.publicKey.toString()][mint] === undefined
    ) {
      findAssociatedTokenAddress(wallet.publicKey, new PublicKey(mint)).then(
        (assocTok) => {
          let walletAccounts = Object.assign(
            {},
            associatedTokensCache[wallet.publicKey.toString()],
          );
          walletAccounts[mint] = assocTok;
          associatedTokensCache[wallet.publicKey.toString()] = walletAccounts;
        },
      );
    }
  }

  let closePrice = tokensData?.get(`${tokenSymbol?.toUpperCase()}`) || 0;

  let priceForCalculate = closePrice;

  if (isUSDToken(tokenSymbol)) {
    priceForCalculate = 1;
  }

  const quote = 'USDC';

  const usdValue =
    priceForCalculate === undefined // Not yet loaded.
      ? undefined
      : priceForCalculate === null // Loaded and empty.
      ? null
      : +(amount * priceForCalculate).toFixed(2); // Loaded.

  let isAssociatedToken = mint ? false : false;

  if (
    wallet &&
    wallet.publicKey &&
    mint &&
    associatedTokensCache[wallet.publicKey.toString()]
  ) {
    let acc =
      associatedTokensCache[wallet.publicKey.toString()][mint.toString()];
    if (acc) {
      if (acc.equals(publicKey)) {
        isAssociatedToken = true;
      } else {
        isAssociatedToken = false;
      }
    }
  }

  return (
    <StyledTr key={`${publicKey}`} theme={theme}>
      <StyledTd>
        <ValuesContainer justify="flex-start">
          <Row margin="0 1rem 0 0">
            <TokenIcon
              tokenLogoUri={tokenLogoUri}
              mint={mint}
              tokenName={tokenName}
              size={'3.6rem'}
            />
          </Row>
          <Row direction="column">
            <RowContainer justify="flex-start">
              <AssetSymbol>
                {tokenSymbol && tokenSymbol.length > 16
                  ? tokenSymbol.slice(0, 16) + '...'
                  : tokenSymbol}
              </AssetSymbol>
              <AssetName theme={theme}>
                {tokenName && tokenName.length > 32
                  ? tokenName.slice(0, 32) + '...'
                  : tokenName}
              </AssetName>
            </RowContainer>
            <RowContainer justify="flex-start">
              <AssetAmount theme={theme}>{`${stripDigitPlaces(
                amount,
                8,
              )} ${tokenSymbol}`}</AssetAmount>
            </RowContainer>
          </Row>
        </ValuesContainer>
        <ValuesContainerForExtension>
          <Row margin="0 1rem 0 0">
            <TokenIcon
              tokenLogoUri={tokenLogoUri}
              mint={mint}
              tokenName={tokenName}
              size={'3.6rem'}
            />
          </Row>
          <Row direction="column">
            <RowContainer justify="flex-start">
              <AssetAmountUSD theme={theme}>{` $${stripDigitPlaces(
                usdValue || 0,
                2,
              )}`}</AssetAmountUSD>
            </RowContainer>
            <RowContainer justify="flex-start">
              <AssetAmount theme={theme}>{`${stripDigitPlaces(
                amount,
                8,
              )} ${tokenSymbol}`}</AssetAmount>
            </RowContainer>
          </Row>
        </ValuesContainerForExtension>
      </StyledTd>

      <StyledTd style={{ paddingRight: '2rem' }}>
        <RowContainer direction="column" align="flex-start">
          <GreyTitle theme={theme}>Total:</GreyTitle>
          <AssetAmountUSD theme={theme}>
            {priceForCalculate
              ? ` $${stripDigitPlaces(amount * priceForCalculate || 0, 2)}`
              : '-'}
          </AssetAmountUSD>
        </RowContainer>
      </StyledTd>
      {/* <StyledTd style={{ paddingRight: '2rem' }}>
        <RowContainer direction="column" align="flex-start">
          <GreyTitle theme={theme}>P&L 24h:</GreyTitle>
          <Title fontSize="1.4rem" fontFamily="Avenir Next Demi">
            Soon
          </Title>
        </RowContainer>
      </StyledTd> */}
      <StyledTd>
        <RowContainer direction="column" align="flex-start">
          <GreyTitle theme={theme}>Price</GreyTitle>
          <Title fontSize="1.4rem" fontFamily="Avenir Next Demi">
            {priceForCalculate
              ? `$
            ${formatNumberToUSFormat(
              stripDigitPlaces(
                priceForCalculate || 0,
                priceForCalculate < 1 ? 8 : 2,
              ),
            )}`
              : '-'}
          </Title>
        </RowContainer>
      </StyledTd>
      {/* <StyledTd>
        <RowContainer direction="column" align="flex-start">
          <GreyTitle theme={theme}>Change 24h:</GreyTitle>
          <RowContainer justify="flex-start">
            <Title fontSize="1.4rem" color={color}>
              {!priceChangePercentage
                ? '0%'
                : `${sign24hChange}${formatNumberToUSFormat(
                    stripDigitPlaces(Math.abs(priceChangePercentage), 2),
                  )}% `}
              &nbsp;
            </Title>
            <Title fontSize="1.4rem">/</Title>&nbsp;
            <Title
              color={color}
              fontSize="1.4rem"
              fontFamily="Avenir Next Demi"
            >
              {` ${sign24hChange}$${formatNumberToUSFormat(
                stripDigitPlaces(Math.abs(lastPriceDiff), 2),
              )}`}
            </Title>
          </RowContainer>
        </RowContainer>
      </StyledTd> */}
      <StyledTd>
        <RowContainer justify="flex-end">
          <VioletButton
            theme={theme}
            height="50%"
            width="10rem"
            background={'linear-gradient(135deg, #53DF11 0%, #97E873 100%)'}
            color={theme.customPalette.dark.background}
            hoverColor={theme.customPalette.white.main}
            hoverBackground={
              'linear-gradient(135deg, #53DF11 0%, #97E873 100%)'
            }
            margin="0 2rem 0 0"
            onClick={() => {
              selectToken({ publicKey, isAssociatedToken });
              setDepositDialogOpen(true);
            }}
          >
            <img
              src={ReceiveIcon}
              alt="receive"
              style={{ marginRight: '.5rem' }}
            />
            <span>Receive</span>
          </VioletButton>

          <VioletButton
            theme={theme}
            height="50%"
            width="7rem"
            background={
              'linear-gradient(140.41deg, #F26D68 0%, #F69894 92.17%)'
            }
            hoverBackground={
              'linear-gradient(140.41deg, #F26D68 0%, #F69894 92.17%)'
            }
            margin="0 2rem 0 0"
            onClick={() => {
              selectToken({ publicKey, isAssociatedToken });
              setSendDialogOpen(true);
            }}
          >
            <img src={SendIcon} alt="send" style={{ marginRight: '.5rem' }} />
            Send
          </VioletButton>

          {false && mint && amount === 0 && (
            <VioletButton
              theme={theme}
              height="50%"
              width="7rem"
              background={
                'linear-gradient(140.41deg, #F26D68 0%, #F69894 92.17%)'
              }
              hoverBackground={
                'linear-gradient(140.41deg, #F26D68 0%, #F69894 92.17%)'
              }
              margin="0 2rem 0 0"
              onClick={() => {
                selectToken({ publicKey, isAssociatedToken });
                setCloseTokenAccountDialogOpen(true);
              }}
            >
              <img src={SendIcon} alt="send" style={{ marginRight: '.5rem' }} />
              Delete
            </VioletButton>
          )}

          <VioletButton
            theme={theme}
            component="a"
            target="_blank"
            rel="noopener"
            href={
              `https://solanabeach.io/address/${publicKey.toBase58()}` +
              urlSuffix
            }
            height="50%"
            width="14rem"
            margin="0 2rem 0 0"
          >
            <img
              src={ExplorerIcon}
              alt="Explorer Icon"
              style={{ marginRight: '.5rem' }}
            />
            View Explorer
          </VioletButton>
          <VioletButton
            theme={theme}
            component="a"
            target="_blank"
            disabled={
              !tokensData ||
              (!tokensData.has(`${tokenSymbol?.toUpperCase()}`) &&
                !tokensData.has(`${tokenSymbol?.toUpperCase()}`)) ||
              tokenSymbol === 'USDC'
            }
            rel="noopener"
            href={`https://dex.aldrin.com/chart/spot/${tokenSymbol?.toUpperCase()}_${quote}#connect_wallet`}
            height="50%"
            width="7rem"
            margin="0 2rem 0 0"
          >
            Trade
          </VioletButton>

          {/* <VioletButton
            theme={theme}
            height="50%"
            width="7rem"
            margin="0 2rem 0 0"
          >
            Swap
          </VioletButton> */}
        </RowContainer>
      </StyledTd>
      <StyledTdMenu style={{ textAlign: 'end', cursor: 'pointer' }}>
        <DropdownContainer>
          <img alt={'open menu'} src={Dots} />
          <ActivitiesDropdown
            urlSuffix={urlSuffix}
            selectToken={() => selectToken({ publicKey, isAssociatedToken })}
            setSendDialogOpen={setSendDialogOpen}
            setDepositDialogOpen={setDepositDialogOpen}
            publicKey={publicKey}
            tokensData={tokensData}
            tokenSymbol={tokenSymbol}
            theme={theme}
            quote={quote}
          />
        </DropdownContainer>
      </StyledTdMenu>
    </StyledTr>
  );
};

export default React.memo(AssetsTable, (prev, next) => {
  return (
    prev.isActive === next.isActive &&
    JSON.stringify([...prev.allTokensData.values()]) ===
      JSON.stringify([...next.allTokensData.values()]) &&
    JSON.stringify([...prev.tokensData.values()]) ===
      JSON.stringify([...next.tokensData.values()])
  );
});

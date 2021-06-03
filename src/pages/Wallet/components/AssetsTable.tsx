import React, { useCallback, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Theme, useTheme } from '@material-ui/core';

import { Row, RowContainer, Title, VioletButton } from '../../commonStyles';

import TokenIcon from '../../../components/TokenIcon';
import {
  refreshWalletPublicKeys,
  useBalanceInfo,
  useWallet,
  useWalletPublicKeys,
} from '../../../utils/wallet';

import {
  refreshAccountInfo,
  useConnection,
  useSolanaExplorerUrlSuffix,
} from '../../../utils/connection';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';
import { BtnCustom } from '../../../components/BtnCustom';

import AddIcon from '../../../images/addIcon.svg';
import Dots from '../../../images/Dots.svg';
import RefreshIcon from '../../../images/refresh.svg';
import ReceiveIcon from '../../../images/receive.svg';
import SendIcon from '../../../images/send.svg';
import ExplorerIcon from '../../../images/explorer.svg';
import { MarketsDataSingleton } from '../../../components/MarketsDataSingleton';
import { priceStore, serumMarkets } from '../../../utils/markets';
import ActivitiesDropdown from './ActivitiesDropdown';
import { findAssociatedTokenAddress } from '../../../utils/tokens';

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
// Aggregated $USD values of all child BalanceListItems child components.
//
// Values:
// * undefined => loading.
// * null => no market exists.
// * float => done.
//
// For a given set of publicKeys, we know all the USD values have been loaded when
// all of their values in this object are not `undefined`.
export const assetsValues: any = {};

// Calculating associated token addresses is an asynchronous operation, so we cache
// the values so that we can quickly render components using them. This prevents
// flickering for the associated token fingerprint icon.
export const associatedTokensCache = {};

export function fairsIsLoaded(publicKeys) {
  return (
    publicKeys.filter((pk) => assetsValues[pk.toString()] !== undefined)
      .length === publicKeys.length
  );
}

const AssetsTable = ({
  isActive,
  selectToken,
  setSendDialogOpen,
  setDepositDialogOpen,
  setShowAddTokenDialog,
}: {
  isActive?: boolean;
  selectToken: ({
    publicKey,
    isAssociatedToken,
  }: {
    publicKey: string;
    isAssociatedToken: boolean;
  }) => void;
  setSendDialogOpen: (isOpen: boolean) => void;
  setDepositDialogOpen: (isOpen: boolean) => void;
  setShowAddTokenDialog: (isOpen: boolean) => void;
}) => {
  const theme = useTheme();
  const wallet = useWallet();
  const [, setTotalUSD] = useState(0);
  const [marketsData, setMarketsData] = useState<any>(null);
  const [publicKeys] = useWalletPublicKeys();

  useEffect(() => {
    const getData = async () => {
      const data = await MarketsDataSingleton.getData();
      setMarketsData(data);
    };

    getData();
  }, []);

  // Dummy var to force rerenders on demand.
  const sortedPublicKeys = useMemo(
    () =>
      Array.isArray(publicKeys)
        ? [...publicKeys].sort((a, b) => {
            const aVal = assetsValues[a.toString()]?.usdValue;
            const bVal = assetsValues[b.toString()]?.usdValue;

            // SOL always fisrt
            if (a.equals(wallet.publicKey)) return -1;
            if (b.equals(wallet.publicKey)) return 1;

            a = aVal === undefined || aVal === null ? -1 : aVal;
            b = bVal === undefined || bVal === null ? -1 : bVal;

            if (b < a) {
              return -1;
            } else if (b > a) {
              return 1;
            } else {
              return 0;
            }
          })
        : [],
    [publicKeys, wallet.publicKey],
  );

  // const selectedAccount = accounts.find((a) => a.isSelected);
  // const allTokensLoaded = loaded && fairsIsLoaded(publicKeys);

  // Memoized callback and component for the `BalanceListItems`.
  //
  // The `BalancesList` fetches data, e.g., fairs for tokens using React hooks
  // in each of the child `BalanceListItem` components. However, we want the
  // parent component, to aggregate all of this data together, for example,
  // to show the cumulative USD amount in the wallet.
  //
  // To achieve this, we need to pass a callback from the parent to the chlid,
  // so that the parent can collect the results of all the async network requests.
  // However, this can cause a render loop, since invoking the callback can cause
  // the parent to rerender, which causese the child to rerender, which causes
  // the callback to be invoked.
  //
  // To solve this, we memoize all the `BalanceListItem` children components

  const setUsdValuesCallback = useCallback(
    (publicKey, usdValue) => {
      assetsValues[publicKey.toString()] = {
        ...assetsValues[publicKey.toString()],
        usdValue,
      };

      const totalUsdValue: any = sortedPublicKeys
        .filter((pk) => assetsValues[pk.toString()])
        .map((pk) => assetsValues[pk.toString()].usdValue)
        .reduce((a, b) => a + b, 0.0);

      if (fairsIsLoaded(sortedPublicKeys)) {
        setTotalUSD(totalUsdValue);
      }
    },
    [sortedPublicKeys],
  );

  const memoizedAssetsList = useMemo(() => {
    return sortedPublicKeys.map((pk, i) => {
      return React.memo(() => {
        return (
          <AssetItem
            key={`${pk.toString()}-${i}-table`}
            publicKey={pk}
            theme={theme}
            marketsData={marketsData}
            setUsdValue={setUsdValuesCallback}
            selectToken={selectToken}
            setSendDialogOpen={setSendDialogOpen}
            setDepositDialogOpen={setDepositDialogOpen}
          />
        );
      });
    });
  }, [
    sortedPublicKeys,
    theme,
    marketsData,
    selectToken,
    setSendDialogOpen,
    setDepositDialogOpen,
    setUsdValuesCallback,
  ]);

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
            onClick={() => {
              try {
                refreshWalletPublicKeys(wallet);
                sortedPublicKeys.forEach((publicKey) => {
                  refreshAccountInfo(wallet.connection, publicKey, true);
                });
              } catch (e) {
                console.error(e);
              }
            }}
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
            {memoizedAssetsList.map((MemoizedAsset, i) => (
              <MemoizedAsset key={i} />
            ))}
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
  marketsData = new Map(),
  setUsdValue,
}: {
  publicKey: any;
  theme: Theme;
  marketsData: any;
  setUsdValue: (publicKey: any, usdValue: null | number) => void;
  selectToken: ({
    publicKey,
    isAssociatedToken,
  }: {
    publicKey: string;
    isAssociatedToken: boolean;
  }) => void;
  setSendDialogOpen: (isOpen: boolean) => void;
  setDepositDialogOpen: (isOpen: boolean) => void;
}) => {
  const wallet = useWallet();
  const balanceInfo = useBalanceInfo(publicKey);
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const connection = useConnection();

  let {
    amount,
    decimals,
    mint,
    tokenName,
    tokenSymbol,
    tokenLogoUri,
  } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
    tokenLogoUri: null,
  };

  const coin = balanceInfo?.tokenSymbol.toUpperCase();
  const [price, setPriceRaw] = useState(assetsValues[publicKey]?.price);
  const isUSDT =
    coin === 'USDT' || coin === 'USDC' || coin === 'WUSDC' || coin === 'WUSDT';

  const setPrice = useCallback(
    (price: number | undefined | null) => {
      assetsValues[publicKey] = { ...assetsValues[publicKey], price };
      setPriceRaw(price);
    },
    [setPriceRaw, publicKey],
  );

  useEffect(() => {
    if (balanceInfo && assetsValues[publicKey] === undefined) {
      if (balanceInfo.tokenSymbol) {
        // Don't fetch USD stable coins. Mark to 1 USD.
        if (isUSDT) {
          setPrice(1);
        }
        // A Serum market exists. Fetch the price.
        else if (serumMarkets[coin]) {
          let m = serumMarkets[coin];

          priceStore
            .getPrice(connection, m.name)
            .then((price) => {
              setPrice(price || 0);
            })
            .catch((err) => {
              console.error(err);
              setPrice(null);
            });
        }
        // No Serum market exists.
        else {
          setPrice(null);
        }
      }
      // No token symbol so don't fetch market data.
      else {
        setPrice(null);
      }
    }

    return () => {};
  }, [price, balanceInfo, connection, coin, isUSDT, setPrice, publicKey]);

  // Fetch and cache the associated token address.
  if (wallet && wallet.publicKey && mint) {
    if (
      associatedTokensCache[wallet.publicKey.toString()] === undefined ||
      associatedTokensCache[wallet.publicKey.toString()][mint.toString()] ===
        undefined
    ) {
      findAssociatedTokenAddress(wallet.publicKey, mint).then((assocTok) => {
        let walletAccounts = Object.assign(
          {},
          associatedTokensCache[wallet.publicKey.toString()],
        );
        walletAccounts[mint.toString()] = assocTok;
        associatedTokensCache[wallet.publicKey.toString()] = walletAccounts;
        // if (assocTok.equals(publicKey)) {
        //   // Force a rerender now that we've cached the value.
        //   setForceUpdate((forceUpdate) => !forceUpdate);
        // }
      });
    }
  }

  let { lastPriceDiff, closePrice } = (!!marketsData &&
    (marketsData.get(`${tokenSymbol?.toUpperCase()}_USDT`) ||
      marketsData.get(`${tokenSymbol?.toUpperCase()}_USDC`))) || {
    closePrice: 0,
    lastPriceDiff: 0,
  };

  let priceForCalculate = !price ? (!closePrice ? price : closePrice) : price;

  const prevClosePrice = (priceForCalculate || 0) + lastPriceDiff * -1;
  const quote = !!marketsData
    ? marketsData.has(`${tokenSymbol?.toUpperCase()}_USDT`)
      ? 'USDT'
      : marketsData.has(`${tokenSymbol?.toUpperCase()}_USDC`)
      ? 'USDC'
      : 'USDT'
    : 'USDT';

  const priceChangePercentage = !!priceForCalculate
    ? !!prevClosePrice
      ? (priceForCalculate - prevClosePrice) / (prevClosePrice / 100)
      : 100
    : 0;

  const sign24hChange =
    +priceChangePercentage === 0 ? '' : +priceChangePercentage > 0 ? `+` : `-`;

  const color =
    +priceChangePercentage === 0
      ? '#ecf0f3'
      : +priceChangePercentage > 0
      ? theme.customPalette.green.light
      : theme.customPalette.red.main;

  const usdValue =
    priceForCalculate === undefined // Not yet loaded.
      ? undefined
      : priceForCalculate === null // Loaded and empty.
      ? null
      : +((amount / Math.pow(10, decimals)) * priceForCalculate).toFixed(2); // Loaded.

  // add saved usd value
  useEffect(() => {
    if (
      usdValue !== undefined &&
      usdValue !== assetsValues[publicKey]?.usdValue
    ) {
      setUsdValue(publicKey, usdValue === null ? null : usdValue);
    }

    return () => {};
  }, [setUsdValue, publicKey, usdValue]);

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
                amount / Math.pow(10, decimals),
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
                amount / Math.pow(10, decimals),
                8,
              )} ${tokenSymbol}`}</AssetAmount>
            </RowContainer>
          </Row>
        </ValuesContainerForExtension>
      </StyledTd>

      <StyledTd style={{ paddingRight: '2rem' }}>
        <RowContainer direction="column" align="flex-start">
          <GreyTitle theme={theme}>Amount:</GreyTitle>
          <AssetAmountUSD theme={theme}>{` $${stripDigitPlaces(
            (amount / Math.pow(10, decimals)) * priceForCalculate || 0,
            2,
          )}`}</AssetAmountUSD>
        </RowContainer>
      </StyledTd>
      <StyledTd style={{ paddingRight: '2rem' }}>
        <RowContainer direction="column" align="flex-start">
          <GreyTitle theme={theme}>P&L 24h:</GreyTitle>
          <Title fontSize="1.4rem" fontFamily="Avenir Next Demi">
            Soon
          </Title>
        </RowContainer>
      </StyledTd>
      <StyledTd>
        <RowContainer direction="column" align="flex-start">
          <GreyTitle theme={theme}>Price</GreyTitle>
          <Title fontSize="1.4rem" fontFamily="Avenir Next Demi">
            $
            {formatNumberToUSFormat(
              stripDigitPlaces(
                priceForCalculate || 0,
                priceForCalculate < 1 ? 8 : 2,
              ),
            )}
          </Title>
        </RowContainer>
      </StyledTd>
      <StyledTd>
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
      </StyledTd>
      <StyledTd>
        <RowContainer justify="flex-end">
          <VioletButton
            theme={theme}
            height="50%"
            width="10rem"
            background={'linear-gradient(135deg, #A5E898 0%, #97E873 100%)'}
            color={theme.customPalette.dark.background}
            hoverColor={theme.customPalette.white.main}
            hoverBackground={
              'linear-gradient(135deg, #A5E898 0%, #97E873 100%)'
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

          <VioletButton
            theme={theme}
            component="a"
            target="_blank"
            rel="noopener"
            href={
              `https://explorer.solana.com/account/${publicKey.toBase58()}` +
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
              !marketsData ||
              (!marketsData.has(`${tokenSymbol?.toUpperCase()}_USDC`) &&
                !marketsData.has(`${tokenSymbol?.toUpperCase()}_USDT`))
            }
            rel="noopener"
            href={`https://dex.cryptocurrencies.ai/chart/spot/${tokenSymbol?.toUpperCase()}_${quote}#connect_wallet`}
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
            marketsData={marketsData}
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
  return prev.isActive === next.isActive;
});

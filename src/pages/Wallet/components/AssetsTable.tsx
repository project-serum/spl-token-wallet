import { Theme, useTheme } from '@material-ui/core';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Row, RowContainer, Title, VioletButton } from '../../commonStyles';

import TokenIcon from '../../../components/TokenIcon';

import AddIcon from '../../../images/addIcon.svg';
import RefreshIcon from '../../../images/refresh.svg';
import { serumMarkets, priceStore } from '../../../utils/markets';
import { useBalanceInfo, useWalletPublicKeys } from '../../../utils/wallet';

import { useConnection } from '../../../utils/connection';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';

const TableContainer = styled(({ theme, ...props }) => (
  <RowContainer {...props} />
))`
  background: ${(props) => props.theme.customPalette.grey.background};
  border: ${(props) => props.theme.customPalette.border.new};
  border-radius: 1.2rem;
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

`;

const HeadRow = styled(Row)`
  padding: 1.2rem 0;
  text-align: right;
  width: 10%;
  border-bottom: ${(props) => props.theme.customPalette.border.new};
`;

const GreyTitle = styled(({ theme, ...props }) => (
  <Title
    color={theme.customPalette.grey.light}
    fontFamily="Avenir Next Demi"
    fontSize="1.4rem"
    {...props}
  />
))``;

const StyledTr = styled.tr`
  &:hover td {
    background: ${props => props.theme.customPalette.dark.background};
    transition: .3s all ease-out;
  }
`;

const StyledTd = styled.td`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const AssetSymbol = styled(Title)`
  font-size: 2rem;
  font-family: Avenir Next Demi;
`

const AssetName = styled(Title)`
  color: ${props => props.theme.customPalette.grey.light};
  font-size: 1.4rem;
  font-family: Avenir Next;
  margin-left: .5rem;
`

const AssetAmount = styled(Title)`
  color: ${props => props.theme.customPalette.green.light};
  font-size: 1.4rem;
  font-family: Avenir Next;
`

const AssetAmountUSD = styled(AssetAmount)`
  font-family: Avenir Next Demi;
`

// const balanceFormat = new Intl.NumberFormat(undefined, {
//   minimumFractionDigits: 4,
//   maximumFractionDigits: 4,
//   useGrouping: true,
// });

// Aggregated $USD values of all child BalanceListItems child components.
//
// Values:
// * undefined => loading.
// * null => no market exists.
// * float => done.
//
// For a given set of publicKeys, we know all the USD values have been loaded when
// all of their values in this object are not `undefined`.
export const usdValues = {};

// Calculating associated token addresses is an asynchronous operation, so we cache
// the values so that we can quickly render components using them. This prevents
// flickering for the associated token fingerprint icon.
export const associatedTokensCache = {};

function fairsIsLoaded(publicKeys) {
  return (
    publicKeys.filter((pk) => usdValues[pk.toString()] !== undefined).length ===
    publicKeys.length
  );
}

const AssetsTable = () => {
  const theme = useTheme();

  const [
    publicKeys,
    // loaded
  ] = useWalletPublicKeys();
  // const { accounts, setAccountName } = useWalletSelector();

  // Dummy var to force rerenders on demand.
  const [, setForceUpdate] = useState(false);
  // const selectedAccount = accounts.find((a) => a.isSelected);
  // const allTokensLoaded = loaded && fairsIsLoaded(publicKeys);

  // const totalUsdValue = sortedPublicKeys
  //   .filter((pk) => usdValues[pk.toString()])
  //   .map((pk) => usdValues[pk.toString()])
  //   .reduce((a, b) => a + b, 0.0);

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
      if (usdValues[publicKey.toString()] !== usdValue) {
        usdValues[publicKey.toString()] = usdValue;
        if (fairsIsLoaded(publicKeys)) {
          setForceUpdate((forceUpdate) => !forceUpdate);
        }
      }
    },
    [publicKeys],
  );

  const memoizedAssetsList = useMemo(() => {
    const sortedPublicKeys = Array.isArray(publicKeys) ? publicKeys : [];

    return sortedPublicKeys.map((pk) => {
      return React.memo((props) => {
        return (
          <AssetItem
            key={pk.toString()}
            publicKey={pk}
            theme={theme}
            setUsdValue={setUsdValuesCallback}
          />
        );
      });
    });
  }, [publicKeys, setUsdValuesCallback, theme]);

  return (
    <TableContainer
      theme={theme}
      height="80%"
      direction="column"
      justify={'flex-start'}
    >
      <RowContainer theme={theme}>
        <HeadRow
          theme={theme}
          justify="flex-start"
          style={{ width: '80%', padding: '1.2rem 0 1.2rem 2.4rem' }}
        >
          <GreyTitle theme={theme}>Assets</GreyTitle>
        </HeadRow>
        <HeadRow theme={theme}>
          <img src={AddIcon} alt="addIcon" style={{ marginRight: '1rem' }} />
          <GreyTitle theme={theme}>Add token</GreyTitle>
        </HeadRow>
        <HeadRow theme={theme}>
          <img
            src={RefreshIcon}
            alt="refreshIcon"
            style={{ marginRight: '1rem' }}
          />
          <GreyTitle theme={theme}>Refresh</GreyTitle>
        </HeadRow>
      </RowContainer>
      <StyledTable theme={theme}>
        {memoizedAssetsList.map((MemoizedAsset) => (
          <MemoizedAsset />
        ))}
      </StyledTable>
    </TableContainer>
  );
};

const AssetItem = ({
  publicKey,
  setUsdValue,
  theme,
}: {
  publicKey: any;
  theme: Theme;
  setUsdValue: (publicKey: any, usdValue: null | number) => void;
}) => {
  const balanceInfo = useBalanceInfo(publicKey);
  let { amount, decimals, mint, tokenName, tokenSymbol } = balanceInfo || {};

  const connection = useConnection();
  // const [, setForceUpdate] = useState(false);

  const [price, setPrice] = useState<undefined | null | number>(undefined);

  useEffect(() => {
    if (balanceInfo) {
      if (balanceInfo.tokenSymbol) {
        const coin = balanceInfo.tokenSymbol.toUpperCase();
        // Don't fetch USD stable coins. Mark to 1 USD.
        if (coin === 'USDT' || coin === 'USDC') {
          setPrice(1);
        }
        // A Serum market exists. Fetch the price.
        else if (serumMarkets[coin]) {
          let m = serumMarkets[coin];
          priceStore
            .getPrice(connection, m.name)
            .then((price) => {
              setPrice(price);
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
  }, [price, balanceInfo, connection]);

  const usdValue =
    price === undefined // Not yet loaded.
      ? undefined
      : price === null // Loaded and empty.
      ? null
      : ((amount / Math.pow(10, decimals)) * price).toFixed(2); // Loaded.

  if (setUsdValue && usdValue !== undefined) {
    setUsdValue(publicKey, usdValue === null ? null : parseFloat(usdValue));
  }

  return (
    <StyledTr theme={theme}>
      <StyledTd>
        <RowContainer justify="flex-start">
          <Row margin="0 1rem 0 0">
            <TokenIcon mint={mint} tokenName={tokenName} size={'3.6rem'} />
          </Row>
          <Row direction="column">
            <RowContainer justify="flex-start">
              <AssetSymbol>{tokenSymbol}</AssetSymbol>
              <AssetName theme={theme}>{tokenName}</AssetName>
            </RowContainer>
            <RowContainer justify="flex-start">
              <AssetAmount theme={theme}>{`${amount} ${tokenSymbol} / `}</AssetAmount>{'  '}<AssetAmountUSD theme={theme}>{` $${usdValue || '0'} `}</AssetAmountUSD>
            </RowContainer>
          </Row>
        </RowContainer>
      </StyledTd>
      <StyledTd>
        <RowContainer direction="column" align="flex-start">
            <GreyTitle theme={theme}>
              Price
            </GreyTitle>
            <Title>
              ${formatNumberToUSFormat(stripDigitPlaces(price || 0, 4))}
            </Title>
        </RowContainer>
      </StyledTd>
      {/* <StyledTd>change</StyledTd> */}
      <StyledTd>
        <RowContainer>
          <VioletButton theme={theme} height="50%" width="75%">receive</VioletButton>
        </RowContainer>
      </StyledTd>
      <StyledTd><VioletButton theme={theme} height="50%" width="75%">send</VioletButton></StyledTd>
      <StyledTd><VioletButton theme={theme} height="50%" width="75%">view explorer</VioletButton></StyledTd>
      <StyledTd><VioletButton theme={theme} height="50%" width="75%">trade</VioletButton></StyledTd>
      <StyledTd><VioletButton theme={theme} height="50%" width="75%">swap</VioletButton></StyledTd>
    </StyledTr>
  );
};

export default AssetsTable;

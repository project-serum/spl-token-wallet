import React, { useCallback, useState, useMemo, useEffect } from 'react';

import { useBalanceInfo, useWalletPublicKeys, useWalletSelector } from '../../../utils/wallet';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';
import { MarketsDataSingleton } from '../../../components/MarketsDataSingleton';
import { priceStore, serumMarkets } from '../../../utils/markets';
import { useConnection } from '../../../utils/connection';

let usdValuesNavbar: any = {};
let usdValuesTotal: any = {}

const Item = ({
  isNavbar,
  publicKey,
  setUsdValue,
  marketsData,
}: {
  isNavbar: boolean,
  publicKey: string;
  setUsdValue: (publicKey: any, usdValue: null | number) => void;
  marketsData: any;
}) => {
  const balanceInfo = useBalanceInfo(publicKey);

  let { amount, decimals, tokenSymbol } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

  const [price, setPrice] = useState<number | null | undefined>(null);
  const connection = useConnection();
  const usdValues = isNavbar ? usdValuesNavbar : usdValuesTotal

  useEffect(() => {
    if (balanceInfo && !price) {
      if (balanceInfo.tokenSymbol) {
        const coin = balanceInfo.tokenSymbol.toUpperCase();
        // Don't fetch USD stable coins. Mark to 1 USD.
        if (
          coin === 'USDT' ||
          coin === 'USDC' ||
          coin === 'WUSDC' ||
          coin === 'WUSDT'
        ) {
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

    return () => {}
  }, [price, balanceInfo, connection]);

  let { closePrice } = (!!marketsData &&
    (marketsData.get(`${tokenSymbol?.toUpperCase()}_USDT`) ||
      marketsData.get(`${tokenSymbol?.toUpperCase()}_USDC`))) || {
    closePrice: 0,
    lastPriceDiff: 0,
  };

  let priceForCalculate =
    price === null &&
    !priceStore.getFromCache(
      serumMarkets[tokenSymbol.toUpperCase()]?.name || '',
    )
      ? !closePrice
        ? price
        : closePrice
      : price;

  const usdValue =
    priceForCalculate === undefined // Not yet loaded.
      ? undefined
      : priceForCalculate === null // Loaded and empty.
      ? null
      : +((amount / Math.pow(10, decimals)) * priceForCalculate).toFixed(2); // Loaded.

  useEffect(() => {
    if (
      usdValue !== undefined &&
      usdValue !== null &&
      usdValue !== usdValues[publicKey]
    ) {
      setUsdValue(publicKey, usdValue === null ? null : usdValue);
    }

    return () => {}
  }, [setUsdValue, usdValue, publicKey, usdValues]);

  return null;
};

const TotalBalance = ({ isNavbar = true }) => {
  const [marketsData, setMarketsData] = useState<any>(null);
  const [totalUSD, setTotalUSD] = useState(0);

  const { accounts } = useWalletSelector();
  const selectedAccount = accounts.find((a) => a.isSelected);
  const [publicKeys] = useWalletPublicKeys();
  const sortedPublicKeys = useMemo(
    () => (Array.isArray(publicKeys) ? [...publicKeys] : []),
    [publicKeys],
  );

  const usdValues = isNavbar ? usdValuesNavbar : usdValuesTotal;

  useEffect(() => {
    if (isNavbar) usdValuesNavbar = {};
    else {
      usdValuesTotal = {}
    }
  }, [selectedAccount, isNavbar])

  useEffect(() => {
    const getData = async () => {
      const data = await MarketsDataSingleton.getData();
      setMarketsData(data);
    };

    getData();
  }, []);

  const setUsdValuesCallback = useCallback(
    (publicKey, usdValue) => {
      usdValues[publicKey.toString()] = usdValue;
      const totalUsdValue: any = sortedPublicKeys
        .filter((pk) => usdValues[pk.toString()])
        .map((pk) => usdValues[pk.toString()])
        .reduce((a, b) => a + b, 0.0);

      setTotalUSD(totalUsdValue);
    },
    [sortedPublicKeys, usdValues],
  );

  const memoizedAssetsList = useMemo(() => {
    return sortedPublicKeys.map((pk) => {
      return React.memo((props) => {
        return (
          <Item
            key={`${pk.toString()}${isNavbar}`}
            publicKey={pk}
            isNavbar={isNavbar}
            setUsdValue={setUsdValuesCallback}
            marketsData={marketsData}
          />
        );
      });
    });
  }, [sortedPublicKeys, setUsdValuesCallback, marketsData, isNavbar]);

  return (
    <>
      {memoizedAssetsList.map((Memoized) => (
        <Memoized />
      ))}
      <span key={`${isNavbar}-total-balance`}>${formatNumberToUSFormat(stripDigitPlaces(totalUSD, 2))}</span>
    </>
  );
};

export default TotalBalance;

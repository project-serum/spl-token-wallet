import React, { useCallback, useState, useMemo, useEffect } from 'react';

import { useBalanceInfo, useWalletPublicKeys } from '../../../utils/wallet';
import { pairsIsLoaded } from './AssetsTable';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';
import { MarketsDataSingleton } from '../../../components/MarketsDataSingleton';
import { priceStore, serumMarkets } from '../../../utils/markets';
import { useConnection } from '../../../utils/connection';

const usdValues: any = {};

const Item = ({
  publicKey,
  setUsdValue,
  marketsData,
}: {
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

  const [price, setPrice] = useState<number | null | undefined>(undefined);
  const connection = useConnection();

  useEffect(() => {
    if (balanceInfo) {
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
  }, [price, balanceInfo, connection]);

  let { closePrice } = (!!marketsData &&
    (marketsData.get(`${tokenSymbol?.toUpperCase()}_USDT`) ||
      marketsData.get(`${tokenSymbol?.toUpperCase()}_USDC`))) || {
    closePrice: 0,
    lastPriceDiff: 0,
  };

  let priceForCalculate = price === null
    ? !closePrice
      ? price
      : closePrice
    : price;

  const usdValue =
    priceForCalculate === undefined // Not yet loaded.
      ? undefined
      : priceForCalculate === null // Loaded and empty.
      ? null
      : ((amount / Math.pow(10, decimals)) * priceForCalculate).toFixed(2); // Loaded.

  useEffect(() => {
    if (setUsdValue && usdValue !== undefined) {
      setUsdValue(publicKey, usdValue === null ? null : parseFloat(usdValue));
    }
  }, [setUsdValue, usdValue, publicKey]);

  return null;
};

const TotalBalance = ({ isNavbar = true }) => {
  const [marketsData, setMarketsData] = useState<any>(null);
  const [totalUSD, setTotalUSD] = useState(0);
  const [publicKeys] = useWalletPublicKeys();
  const sortedPublicKeys = useMemo(() => Array.isArray(publicKeys) ? [...publicKeys] : [], [publicKeys]);

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
      if (pairsIsLoaded(sortedPublicKeys, usdValues)) {
        const totalUsdValue: any = sortedPublicKeys
          .filter((pk) => usdValues[pk.toString()])
          .map((pk) => usdValues[pk.toString()])
          .reduce((a, b) => a + b, 0.0);
          
        setTotalUSD(totalUsdValue);
      }
    },
    [sortedPublicKeys],
  );

  const memoizedAssetsList = useMemo(() => {
    return sortedPublicKeys.map((pk) => {
      return React.memo((props) => {
        return (
          <Item
            key={`${pk.toString()}${isNavbar}`}
            publicKey={pk}
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
      <span>${formatNumberToUSFormat(stripDigitPlaces(totalUSD, 2))}</span>
    </>
  );
};

export default TotalBalance;

import React, { useCallback, useState, useMemo, useEffect } from 'react';

import {
  useBalanceInfo,
  useWalletPublicKeys,
  useWalletSelector,
} from '../../../utils/wallet';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';
import { MarketsDataSingleton } from '../../../components/MarketsDataSingleton';
import { priceStore, serumMarkets } from '../../../utils/markets';
import { useConnection } from '../../../utils/connection';

let assetsValuesNavbar: any = {};
let assetsValuesTotal: any = {};

const Item = ({
  isNavbar,
  publicKey,
  setUsdValue,
  marketsData,
  totalUSD,
}: {
  isNavbar: boolean;
  publicKey: string;
  setUsdValue: (publicKey: any, usdValue: null | number) => void;
  marketsData: any;
  totalUSD: number
}) => {
  const balanceInfo = useBalanceInfo(publicKey);

  let { amount, decimals, tokenSymbol } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

  const assetsValues = isNavbar ? assetsValuesNavbar : assetsValuesTotal;

  const [price, setPriceRaw] = useState<number | null | undefined>(assetsValues[publicKey]?.price);
  const coin = balanceInfo?.tokenSymbol?.toUpperCase();
  const isUSDT =
    coin === 'USDT' || coin === 'USDC' || coin === 'WUSDC' || coin === 'WUSDT';
  const connection = useConnection();

  const setPrice = useCallback((price: number | undefined | null) => {
    assetsValues[publicKey] = { ...assetsValues[publicKey], price };
    setPriceRaw(price);
  }, [setPriceRaw, publicKey, assetsValues]);

  useEffect(() => {
    if (balanceInfo && price === undefined) {
      if (balanceInfo.tokenSymbol) {
        const coin = balanceInfo.tokenSymbol?.toUpperCase();
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

  let { closePrice } = (!!marketsData &&
    (marketsData.get(`${tokenSymbol?.toUpperCase()}_USDT`) ||
      marketsData.get(`${tokenSymbol?.toUpperCase()}_USDC`))) || {
    closePrice: 0,
    lastPriceDiff: 0,
  };

  let priceForCalculate = !price
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
    if (usdValue !== undefined && usdValue !== assetsValues[publicKey]?.usdValue) {
      setUsdValue(publicKey, usdValue === null ? null : usdValue);
    }

    return () => {};
  }, [setUsdValue, usdValue, publicKey, assetsValues]);

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

  const assetsValues = isNavbar ? assetsValuesNavbar : assetsValuesTotal;

  useEffect(() => {
    if (isNavbar) assetsValuesNavbar = {};
    else {
      assetsValuesTotal = {};
    }
  }, [selectedAccount, isNavbar]);

  useEffect(() => {
    const getData = async () => {
      const data = await MarketsDataSingleton.getData();
      setMarketsData(data);
    };

    getData();
  }, []);

  const setUsdValuesCallback = useCallback(
    (publicKey, usdValue) => {
      assetsValues[publicKey.toString()] = { ...assetsValues[publicKey.toString()], usdValue };

      const totalUsdValue: any = sortedPublicKeys
        .filter((pk) => assetsValues[pk.toString()])
        .map((pk) => assetsValues[pk.toString()].usdValue)
        .reduce((a, b) => a + b, 0.0);

      // if (fairsIsLoaded(sortedPublicKeys)) {
        setTotalUSD(totalUsdValue);
      // }
    },
    [sortedPublicKeys, assetsValues],
  );

  const memoizedAssetsList = useMemo(() => {
    return sortedPublicKeys.map((pk, i) => {
      return React.memo((props) => {
        return (
          <Item
            key={`${pk.toString()}${isNavbar}${i}`}
            publicKey={pk}
            isNavbar={isNavbar}
            setUsdValue={setUsdValuesCallback}
            marketsData={marketsData}
            totalUSD={totalUSD}
          />
        );
      });
    });
  }, [sortedPublicKeys, setUsdValuesCallback, marketsData, isNavbar, totalUSD]);

  return (
    <>
      {memoizedAssetsList.map((Memoized, i) => (
        <Memoized key={`${isNavbar}-${i}`} />
      ))}
      <span key={`${isNavbar}-total-balance`}>
        ${formatNumberToUSFormat(stripDigitPlaces(totalUSD, 2))}
      </span>
    </>
  );
};

export default TotalBalance;

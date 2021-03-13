import React, { useCallback, useState, useMemo, useEffect } from 'react';

import { useBalanceInfo, useWalletPublicKeys } from '../../../utils/wallet';
import { fairsIsLoaded } from './AssetsTable';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';

import { getMarketsData } from './AssetsTable'

const usdValues: any = {};

const Item = ({
  publicKey,
  setUsdValue,
  marketsData,
}: {
  publicKey: string;
  setUsdValue: (publicKey: any, usdValue: null | number) => void;
  marketsData: any
}) => {
  const balanceInfo = useBalanceInfo(publicKey);

  let { amount, decimals, tokenSymbol } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

  let { closePrice: price } = marketsData.get(
    `${tokenSymbol?.toUpperCase()}_USDT`,
  ) || { closePrice: 0, lastPriceDiff: 0 };

  if (tokenSymbol === 'USDT' || tokenSymbol === 'USDC') {
    price = 1
  }

  const usdValue =
    price === undefined // Not yet loaded.
      ? undefined
      : price === null // Loaded and empty.
      ? null
      : ((amount / Math.pow(10, decimals)) * price).toFixed(2); // Loaded.

  if (setUsdValue && usdValue !== undefined) {
    setUsdValue(publicKey, usdValue === null ? null : parseFloat(usdValue));
  }

  return null;
};

const TotalBalance = () => {
  const [publicKeys] = useWalletPublicKeys();
  const [marketsData, setMarketsData] = useState({});
  const [, setForceUpdate] = useState(false);

  const sortedPublicKeys = Array.isArray(publicKeys) ? publicKeys : [];

  useEffect(() => {
    const getData = async () => {
      const data = await getMarketsData();
      setMarketsData(data);
    };

    getData();
  }, []);

  const totalUsdValue = sortedPublicKeys
    .filter((pk) => usdValues[pk.toString()])
    .map((pk) => usdValues[pk.toString()])
    .reduce((a, b) => a + b, 0.0);

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
          <Item
            key={pk.toString()}
            publicKey={pk}
            setUsdValue={setUsdValuesCallback}
            marketsData={marketsData}
          />
        );
      });
    });
  }, [publicKeys, setUsdValuesCallback, marketsData]);

  return (
    <>
      {memoizedAssetsList.map(Memoized => <Memoized />)}
      <span>${formatNumberToUSFormat(stripDigitPlaces(totalUsdValue, 2))}</span>
    </>
  );
};

export default TotalBalance;

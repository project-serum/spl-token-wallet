import React, { useCallback, useState, useMemo, useEffect } from 'react';

import { serumMarkets, priceStore } from '../../../utils/markets';
import { useBalanceInfo, useWalletPublicKeys } from '../../../utils/wallet';

import { fairsIsLoaded } from './AssetsTable';
import { useConnection } from '../../../utils/connection';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';

const usdValues: any = {};

const Item = ({
  publicKey,
  setUsdValue,
}: {
  publicKey: string;
  setUsdValue: (publicKey: any, usdValue: null | number) => void;
}) => {
  const balanceInfo = useBalanceInfo(publicKey);
  let { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

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

  return null;
};

const TotalBalance = () => {
  const [publicKeys] = useWalletPublicKeys();

  const [, setForceUpdate] = useState(false);

  const sortedPublicKeys = Array.isArray(publicKeys) ? publicKeys : [];

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
          />
        );
      });
    });
  }, [publicKeys, setUsdValuesCallback]);

  return (
    <>
      {memoizedAssetsList.map(Memoized => <Memoized />)}
      <span>${formatNumberToUSFormat(stripDigitPlaces(totalUsdValue, 2))}</span>
    </>
  );
};

export default TotalBalance;

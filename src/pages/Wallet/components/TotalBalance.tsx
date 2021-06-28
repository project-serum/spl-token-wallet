import React, { useState, useEffect } from 'react';

import {
  useWallet,
} from '../../../utils/wallet';
import { formatNumberToUSFormat, getAllTokensData, isUSDToken, stripDigitPlaces, TokenInfo } from '../../../utils/utils';
import { MarketsDataSingleton } from '../../../components/MarketsDataSingleton';
import { useConnection } from '../../../utils/connection';
import { useTokenInfos } from '../../../utils/tokens/names';
import { PublicKey } from '@solana/web3.js';

const TotalBalance = ({ isNavbar = true }) => {
  const wallet = useWallet();
  const connection = useConnection()
  const tokenInfos = useTokenInfos()
  const [marketsData, setMarketsData] = useState<any>(null);
  const [allTokensData, setAllTokensData] = useState<Map<string, TokenInfo>>(new Map());

  const walletPubkey = wallet?.publicKey?.toString()

  useEffect(() => {
    const getData = async () => {
      const data = await MarketsDataSingleton.getData();
      const allTokensInfo = await getAllTokensData(new PublicKey(walletPubkey), connection, tokenInfos)

      setMarketsData(data);
      setAllTokensData(allTokensInfo)
    };

    getData();
  }, [connection, walletPubkey, tokenInfos]);

  const totalUSD = [...allTokensData.values()].reduce((acc, cur) => {
    const isTokenUSDT = isUSDToken(cur.symbol)

    let tokenPrice = (marketsData.get(`${cur.symbol}_USDC`) || marketsData.get(`${cur.symbol}_USDT`) || { closePrice: 0 }).closePrice
    if (isTokenUSDT) tokenPrice = 1

    return acc + (cur.amount * tokenPrice)
  }, 0)

  return (
    <>
      <span key={`${isNavbar}-total-balance`}>
        ${formatNumberToUSFormat(stripDigitPlaces(totalUSD, 2))}
      </span>
    </>
  );
};

export default TotalBalance;

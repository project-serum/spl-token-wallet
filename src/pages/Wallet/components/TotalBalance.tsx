import React from 'react';
import {
  formatNumberToUSFormat,
  isUSDToken,
  stripDigitPlaces,
  TokenInfo,
} from '../../../utils/utils';

const TotalBalance = ({
  isNavbar = true,
  allTokensData,
  marketsData,
}: {
  isNavbar: boolean;
  allTokensData: Map<string, TokenInfo>;
  marketsData: Map<string, any>;
}) => {
  // const wallet = useWallet();
  // const connection = useConnection();
  // const tokenInfos = useTokenInfos();

  // const walletPubkey = wallet?.publicKey?.toString();

  const totalUSD = [...allTokensData.values()].reduce((acc, cur) => {
    const isTokenUSDT = isUSDToken(cur.symbol);

    let tokenPrice = (
      marketsData.get(`${cur.symbol}_USDC`) ||
      marketsData.get(`${cur.symbol}_USDT`) || { closePrice: 0 }
    ).closePrice;
    if (isTokenUSDT) tokenPrice = 1;

    return acc + cur.amount * tokenPrice;
  }, 0);

  return (
    <>
      <span key={`${isNavbar}-total-balance`}>
        ${formatNumberToUSFormat(stripDigitPlaces(totalUSD, 2))}
      </span>
    </>
  );
};

export default TotalBalance;

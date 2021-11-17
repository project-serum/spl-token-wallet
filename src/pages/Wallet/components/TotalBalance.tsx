import React from 'react';
import {
  formatNumberToUSFormat,
  isUSDToken,
  stripDigitPlaces,
  TokenInfo,
} from '../../../utils/utils';

const TotalBalance = ({
  allTokensData,
  tokensData,
}: {
  allTokensData: Map<string, TokenInfo>;
  tokensData: Map<string, number>;
}) => {
  const totalUSD = [...allTokensData.values()].reduce((acc, cur) => {
    const isTokenUSDT = isUSDToken(cur.symbol);

    let tokenPrice = tokensData.get(`${cur.symbol}`) || 0;
    if (isTokenUSDT) tokenPrice = 1;

    return acc + cur.amount * tokenPrice;
  }, 0);

  return (
    <>
      <span key={`total-balance`}>
        ${formatNumberToUSFormat(stripDigitPlaces(totalUSD, 2))}
      </span>
    </>
  );
};

export default TotalBalance;

import React, { useState } from 'react';
import CoinPlaceholder from '../images/coinPlaceholder.svg';

export default function TokenIcon({
  mint,
  tokenLogoUri,
  tokenName,
  size = '2rem',
  style = {}
}: {
  mint?: any;
  tokenLogoUri?: string;
  tokenName: string;
  size?: string;
  style?: any
}) {
  const [hasError, setHasError] = useState(false);

  if (mint === null) {
    tokenLogoUri =
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
  }

  if (hasError || !tokenLogoUri) {
    tokenLogoUri = CoinPlaceholder;
  }

  return (
    <img
      src={tokenLogoUri}
      title={tokenName}
      alt={tokenName}
      style={{
        width: size,
        height: size,
        borderRadius: `calc(${size} / 2)`,
        ...style,
      }}
      onError={() => setHasError(true)}
    />
  );
}

import React, { useState } from 'react';
import { useConnectionConfig } from '../utils/connection';
import CoinPlaceholder from '../images/coinPlaceholder.svg';

export default function TokenIcon({
  mint,
  tokenLogoUri,
  tokenName,
  size = '2rem',
}: {
  mint?: any;
  tokenLogoUri?: string;
  tokenName: string;
  size?: string;
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
        backgroundColor: 'white',
        borderRadius: `calc(${size} / 2)`,
      }}
      onError={() => setHasError(true)}
    />
  );
}

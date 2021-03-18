import React, { useState } from 'react';
import { useConnectionConfig } from '../utils/connection';
import { TOKENS } from '../utils/tokens/names';
import CoinPlaceholder from '../images/coinPlaceholder.svg'

export default function TokenIcon({
  mint,
  url,
  tokenName,
  size = '2rem',
}: {
  mint?: any;
  url?: string;
  tokenName: string;
  size?: string;
}) {
  const { endpoint } = useConnectionConfig();

  const [hasError, setHasError] = useState(false);

  if (!url) {
    if (mint === null) {
      url =
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
    } else {
      url = TOKENS?.[endpoint]?.find(
        (token) => token.mintAddress === mint?.toBase58(),
      )?.icon;
    }
  }

  if (hasError || !url) {
    url = CoinPlaceholder
  }

  return (
    <img
      src={url}
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
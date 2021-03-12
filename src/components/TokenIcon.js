import { useConnectionConfig } from '../utils/connection';
import { getTokenListForCluster } from '../utils/tokens/names';
import { useAsyncData } from '../utils/fetch-loop';
import React, { useState } from 'react';

export default function TokenIcon({ mint, url, tokenName, size = 20 }) {
  const { endpoint } = useConnectionConfig();
  const [tokenInfos] = useAsyncData(getTokenListForCluster(endpoint));

  const [hasError, setHasError] = useState(false);

  if (!url) {
    if (mint === null) {
      url =
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
    } else {
      url = tokenInfos?.find(
        (token) => token.address === mint?.toBase58(),
      )?.logoURI;
    }
  }

  if (hasError || !url) {
    return null;
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
        borderRadius: size / 2,
      }}
      onError={() => setHasError(true)}
    />
  );
}

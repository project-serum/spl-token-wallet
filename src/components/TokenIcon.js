import React from 'react';
import { Avatar } from 'antd';
import { useConnectionConfig } from '../utils/connection';
import { TOKENS } from '../utils/tokens/names';

export default function TokenIcon({ mint, url, tokenName, size = 20 }) {
  const { endpoint } = useConnectionConfig();

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

  return <Avatar src={url} alt={tokenName} style={{ fontSize: size }} />;
}

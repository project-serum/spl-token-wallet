import EventEmitter from 'events';
import { useConnectionConfig, MAINNET_URL } from '../connection';
import { useListener } from '../utils';
import { useCallback } from 'react';

export const TOKENS = {
  [MAINNET_URL]: [
    {
      mintAddress: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
      tokenName: 'Serum',
      tokenSymbol: 'SRM',
    },
    {
      mintAddress: 'MSRMcoVyrFxnSgo5uXwone5SKcGhT1KEJMFEkMEWf9L',
      tokenName: 'MegaSerum',
      tokenSymbol: 'MSRM',
    },
  ],
};

const customTokenNamesByNetwork = JSON.parse(
  localStorage.getItem('tokenNames') ?? '{}',
);

const nameUpdated = new EventEmitter();
nameUpdated.setMaxListeners(100);

export function useTokenName(mint) {
  const { endpoint } = useConnectionConfig();
  useListener(nameUpdated, 'update');

  if (!mint) {
    return { name: null, symbol: null };
  }

  let info = customTokenNamesByNetwork?.[endpoint]?.[mint.toBase58()];
  if (!info) {
    let match = TOKENS?.[endpoint]?.find(
      (token) => token.mintAddress === mint.toBase58(),
    );
    if (match) {
      info = { name: match.tokenName, symbol: match.tokenSymbol };
    }
  }
  return { name: info?.name, symbol: info?.symbol };
}

export function useUpdateTokenName() {
  const { endpoint } = useConnectionConfig();
  return useCallback(
    function updateTokenName(mint, name, symbol) {
      if (!customTokenNamesByNetwork[endpoint]) {
        customTokenNamesByNetwork[endpoint] = {};
      }
      customTokenNamesByNetwork[endpoint][mint.toBase58()] = { name, symbol };
      localStorage.setItem(
        'tokenNames',
        JSON.stringify(customTokenNamesByNetwork),
      );
      nameUpdated.emit('update');
    },
    [endpoint],
  );
}

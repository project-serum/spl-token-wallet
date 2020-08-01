import EventEmitter from 'events';
import { useConnectionConfig } from '../connection';
import { useListener } from '../utils';
import { useCallback } from 'react';

const customTokenNamesByNetwork = JSON.parse(
  localStorage.getItem('tokenNames') ?? '{}',
);

const nameUpdated = new EventEmitter();

export function useTokenName(mint) {
  const { endpoint } = useConnectionConfig();
  useListener(nameUpdated, 'update');

  if (!mint) {
    return { name: null, symbol: null };
  }

  const info = customTokenNamesByNetwork?.[endpoint]?.[mint.toBase58()];
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

import EventEmitter from 'events';
import { useConnectionConfig } from '../connection';
import { useListener } from '../utils';
import { useCallback } from 'react';
import { TokenListProvider } from '@solana/spl-token-registry';

let tokenListContainer = null;
export async function getTokenListForCluster(cluster) {
  if (tokenListContainer === null) {
    tokenListContainer = await new TokenListProvider().resolve();
  }
  return tokenListContainer.filterByClusterSlug(cluster).getList();
}
new TokenListProvider().resolve().then((tokens) => {
  const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
  console.log(tokenList);
});

// export interface TokenInfo {
//   readonly chainId: number;
//   readonly address: string;
//   readonly name: string;
//   readonly decimals: number;
//   readonly symbol: string;
//   readonly logoURI?: string;
//   readonly tags?: string[];
//   readonly extensions?: TokenExtensions;
// }

const customTokenNamesByNetwork = JSON.parse(
  localStorage.getItem('tokenNames') ?? '{}',
);

const nameUpdated = new EventEmitter();
nameUpdated.setMaxListeners(100);

export async function useTokenName(mint) {
  const { endpoint } = useConnectionConfig();
  useListener(nameUpdated, 'update');
  return getTokenName(mint, endpoint);
}

export async function getTokenName(mint, endpoint) {
  if (!mint) {
    return { name: null, symbol: null };
  }

  let info = customTokenNamesByNetwork?.[endpoint]?.[mint.toBase58()];
  let match = (await getTokenListForCluster(endpoint))?.find(
    (tokenInfo) => tokenInfo.address === mint.toBase58(),
  );
  if (match && !info) {
    info = { name: match.name, symbol: match.symbol };
  }
  return { name: info?.name, symbol: info?.symbol };
}

export function useUpdateTokenName() {
  const { endpoint } = useConnectionConfig();
  return useCallback(
    function updateTokenName(mint, name, symbol) {
      if (!name || !symbol) {
        if (name) {
          symbol = name;
        } else if (symbol) {
          name = symbol;
        } else {
          return;
        }
      }
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

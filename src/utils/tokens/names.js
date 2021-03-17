import React, { useContext, useState, useEffect } from 'react';
import EventEmitter from 'events';
import { useConnectionConfig } from '../connection';
import { useListener } from '../utils';
import { useAsyncData } from '../fetch-loop';
import { clusterForEndpoint } from '../clusters';
import { useCallback } from 'react';
import { TokenListProvider, Strategy } from '@solana/spl-token-registry';

const TokenListContext = React.createContext(null);

export function useTokenInfos() {
  const { tokenInfos } = useContext(TokenListContext);
  return tokenInfos;
}

export function TokenRegistryProvider(props) {
  const { endpoint } = useConnectionConfig();
  const [tokenInfos, setTokenInfos] = useState(null);
  useEffect(() => {
    const tokenListProvider = new TokenListProvider();
    tokenListProvider.resolve().then((tokenListContainer) => {
      const cluster = clusterForEndpoint(endpoint);

      const filteredTokenListContainer = tokenListContainer?.filterByClusterSlug(
        cluster?.name,
      );
      const tokenInfos =
        tokenListContainer !== filteredTokenListContainer
          ? filteredTokenListContainer?.getList()
          : null; // Workaround for filter return all on unknown slug
      setTokenInfos(tokenInfos);
    });
  }, [endpoint]);

  return (
    <TokenListContext.Provider value={{ tokenInfos }}>
      {props.children}
    </TokenListContext.Provider>
  );
}

const customTokenNamesByNetwork = JSON.parse(
  localStorage.getItem('tokenNames') ?? '{}',
);

const nameUpdated = new EventEmitter();
nameUpdated.setMaxListeners(100);

export function useTokenInfo(mint) {
  const { endpoint } = useConnectionConfig();
  useListener(nameUpdated, 'update');
  const tokenInfos = useTokenInfos();
  return getTokenInfo(mint, endpoint, tokenInfos);
}

export function getTokenInfo(mint, endpoint, tokenInfos) {
  if (!mint) {
    return { name: null, symbol: null };
  }

  let info = customTokenNamesByNetwork?.[endpoint]?.[mint.toBase58()];
  let match = tokenInfos?.find(
    (tokenInfo) => tokenInfo.address === mint.toBase58(),
  );
  if (match && !info) {
    info = { name: match.name, symbol: match.symbol, logoUri: match.logoURI };
  }
  return { name: info?.name, symbol: info?.symbol, logoUri: info?.logoUri };
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

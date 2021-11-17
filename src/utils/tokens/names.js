import React, { useContext, useState, useEffect } from 'react';
import EventEmitter from 'events';
import { useConnectionConfig } from '../connection';
import { useListener } from '../utils';
import { clusterForEndpoint } from '../clusters';
import { useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TokenListProvider } from '@solana/spl-token-registry';
import { TOKENS } from './tokens';

const TokenListContext = React.createContext({});

export function useTokenInfosMap() {
  const { tokenInfos } = useContext(TokenListContext);
  const tokenInfosMap = tokenInfos.reduce((acc, tokenInfo) => {
    return acc.set(tokenInfo.address, tokenInfo);
  }, new Map());
  return tokenInfosMap;
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
  const tokenInfosMap = useTokenInfosMap();
  return getTokenInfo(mint, endpoint, tokenInfosMap);
}

export function getTokenInfo(mint, endpoint, tokenInfosMap) {
  if (!mint) {
    return { name: null, symbol: null, logoUri: null };
  }

  let info = customTokenNamesByNetwork?.[endpoint]?.[mint.toBase58()];
  const match = tokenInfosMap?.get(mint.toBase58());

  if (match) {
    if (!info?.address) {
      info = {
        ...match,
        name: match.name.replace(' (Sollet)', ''),
        logoUri: match.logoURI,
      };
    }
    // The user has overridden a name locally.
    else {
      info = {
        ...info,
        name: info.name.replace(' (Sollet)', ''),
        logoUri: match.logoURI,
      };
    }
  }
  return { ...info };
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
// Returns tokenInfos for the popular tokens list.
export function usePopularTokens() {
  const tokenInfosMap = useTokenInfosMap();

  const { endpoint } = useConnectionConfig();
  const tokens = (!TOKENS[endpoint] ? [] : TOKENS[endpoint])
    .map((tok) =>
      getTokenInfo(new PublicKey(tok.mintAddress), endpoint, tokenInfosMap),
    )
    .filter((t) => !!t.address);

  return tokens;
}

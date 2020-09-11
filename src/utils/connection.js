import React, { useContext, useEffect, useMemo } from 'react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useLocalStorageState } from './utils';
import { refreshCache, setCache, useAsyncData } from './fetch-loop';
import tuple from 'immutable-tuple';

const ConnectionContext = React.createContext(null);

export const MAINNET_URL = 'https://solana-api.projectserum.com';
export function ConnectionProvider({ children }) {
  const [endpoint, setEndpoint] = useLocalStorageState(
    'connectionEndpoint',
    MAINNET_URL,
  );

  const connection = useMemo(() => new Connection(endpoint, 'recent'), [
    endpoint,
  ]);

  return (
    <ConnectionContext.Provider value={{ endpoint, setEndpoint, connection }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext).connection;
}

export function useConnectionConfig() {
  let context = useContext(ConnectionContext);
  return { endpoint: context.endpoint, setEndpoint: context.setEndpoint };
}

export function useIsProdNetwork() {
  const endpoint = useContext(ConnectionContext).endpoint;
  return endpoint === MAINNET_URL;
}

export function useSolanaExplorerUrlSuffix() {
  const endpoint = useContext(ConnectionContext).endpoint;
  if (endpoint === clusterApiUrl('devnet')) {
    return '?cluster=devnet';
  } else if (endpoint === clusterApiUrl('testnet')) {
    return '?cluster=testnet';
  }
  return '';
}

export function useAccountInfo(publicKey) {
  const connection = useConnection();
  const cacheKey = tuple(connection, publicKey?.toBase58());
  const [accountInfo, loaded] = useAsyncData(
    async () => (publicKey ? connection.getAccountInfo(publicKey) : null),
    cacheKey,
  );
  useEffect(() => {
    if (!publicKey) {
      return;
    }
    let previousData = null;
    const id = connection.onAccountChange(publicKey, (info) => {
      if (info.data) {
        if (!previousData || !previousData.equals(info.data)) {
          previousData = info.data;
          setCache(cacheKey, info);
        }
      }
    });
    return () => connection.removeAccountChangeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, publicKey?.toBase58(), cacheKey]);
  return [accountInfo, loaded];
}

export function refreshAccountInfo(connection, publicKey, clearCache = false) {
  const cacheKey = tuple(connection, publicKey.toBase58());
  refreshCache(cacheKey, clearCache);
}

export function setInitialAccountInfo(connection, publicKey, accountInfo) {
  const cacheKey = tuple(connection, publicKey.toBase58());
  setCache(cacheKey, accountInfo, { initializeOnly: true });
}

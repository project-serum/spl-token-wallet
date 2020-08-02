import React, { useContext, useEffect, useMemo } from 'react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useLocalStorageState } from './utils';
import { refreshCache, useAsyncData } from './fetch-loop';
import tuple from 'immutable-tuple';

const ConnectionContext = React.createContext(null);

export function ConnectionProvider({ children }) {
  const [endpoint, setEndpoint] = useLocalStorageState(
    'endpoint',
    clusterApiUrl('devnet'),
  );

  const connection = useMemo(() => new Connection(endpoint, 'single'), [
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
  return endpoint === clusterApiUrl('mainnet-beta');
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
      return () => {};
    }
    const id = connection.onAccountChange(publicKey, () =>
      refreshCache(cacheKey),
    );
    return () => connection.removeAccountChangeListener(id);
  }, [connection, publicKey?.toBase58(), cacheKey]);
  return [accountInfo, loaded];
}

export function refreshAccountInfo(connection, publicKey, clearCache = false) {
  const cacheKey = tuple(connection, publicKey.toBase58());
  refreshCache(cacheKey, clearCache);
}

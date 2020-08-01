import React, { useContext, useMemo } from 'react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useLocalStorageState } from './utils';

const ConnectionContext = React.createContext(null);

export function ConnectionProvider({ children }) {
  const [endpoint, setEndpoint] = useLocalStorageState(
    'endpoint',
    clusterApiUrl('devnet'),
  );

  const connection = useMemo(() => new Connection(endpoint), [endpoint]);

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

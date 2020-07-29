import React, { useContext, useMemo } from 'react';
import * as bip32 from 'bip32';
import { Account } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { useConnection } from './connection';

export class Wallet {
  constructor(connection, secretKey) {
    this.connection = connection;
    this.account = new Account(secretKey);
  }

  getSolBalance = async () => {
    return (await this.connection.getBalance(this.account.publicKey)) / 1e9;
  };

  createTokenAccount = async (index, tokenAddress) => {
    // TODO
  };

  getTokenAccount = async (index) => {
    // TODO
  };
}

const WalletContext = React.createContext(null);

export function WalletProvider({ children }) {
  const secretKey = useMemo(() => {
    if (!localStorage.getItem('secretKey')) {
      return localStorage.setItem(
        'secretKey',
        new Buffer(nacl.sign.keyPair().secretKey).toString('hex'),
      );
    }
    return localStorage.getItem('secretKey');
  }, []);
  const connection = useConnection();
  const wallet = useMemo(
    () => new Wallet(connection, Buffer.from(secretKey, 'hex')),
    [connection, secretKey],
  );
  return (
    <WalletContext.Provider value={{ wallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext).wallet;
}

export async function mnemonicToSecretKey(mnemonic) {
  const { mnemonicToSeed } = await import('bip39');
  const rootSeed = Buffer.from(await mnemonicToSeed(mnemonic), 'hex');
  const derivedSeed = bip32.fromSeed(rootSeed).derivePath("m/501'/0'/0/0")
    .privateKey;
  return nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
}

import React, { useContext, useMemo } from 'react';
import * as bip32 from 'bip32';
import { Account, PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { useConnection } from './connection';
import { createAndInitializeTokenAccount } from './tokens';
import { resourceCache } from 'use-async-resource';
import { TOKEN_PROGRAM_ID } from './token-instructions';
import { parseTokenAccountData } from './token-state';

export class Wallet {
  constructor(connection, seed, walletIndex = 0) {
    this.connection = connection;
    this.seed = seed;
    this.walletIndex = walletIndex;
    this.accountCount = 1;
    this.account = this.getAccount(0);
  }

  getAccount = (index) => {
    const derivedSeed = bip32
      .fromSeed(this.seed)
      .derivePath(`m/501'/${this.walletIndex}'/0/${index}`).privateKey;
    return new Account(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
  };

  getAccountBalance = async (index) => {
    let publicKey = this.getAccount(index).publicKey;
    let info = await this.connection.getAccountInfo(publicKey, 'single');

    if (info && this.accountCount < index + 1) {
      this.accountCount = index + 1;
    }

    if (info?.owner.equals(TOKEN_PROGRAM_ID)) {
      let { mint, owner, amount } = parseTokenAccountData(info.data);
      if (!owner.equals(this.account.publicKey)) {
        console.warn(
          'token account %s not owned by wallet',
          publicKey.toBase58(),
        );
        return null;
      }
      return {
        amount,
        decimals: 0, // TODO
        mint,
        tokenName: '???', // TODO
        tokenTicker: '???', // TODO
        initialized: true,
      };
    }

    return {
      amount: info?.lamports ?? 0,
      decimals: 9,
      mint: null,
      tokenName: 'Solana',
      tokenTicker: 'SOL',
      initialized: false,
    };
  };

  createTokenAccount = async (tokenAddress) => {
    let index = this.accountCount;
    await createAndInitializeTokenAccount({
      connection: this.connection,
      payer: this.account,
      mintPublicKey: tokenAddress,
      newAccount: this.getAccount(index),
    });
    ++this.accountCount;
    resourceCache(this.getAccountBalance).delete(index);
  };
}

const WalletContext = React.createContext(null);

export function WalletProvider({ children }) {
  const seed = useMemo(() => {
    if (!localStorage.getItem('seed')) {
      localStorage.setItem(
        'seed',
        new Buffer(nacl.randomBytes(64)).toString('hex'),
      );
    }
    return localStorage.getItem('seed');
  }, []);
  const connection = useConnection();
  const wallet = useMemo(
    () => new Wallet(connection, Buffer.from(seed, 'hex')),
    [connection, seed],
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

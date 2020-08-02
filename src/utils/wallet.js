import React, { useContext, useEffect, useMemo } from 'react';
import * as bip32 from 'bip32';
import { Account } from '@solana/web3.js';
import nacl from 'tweetnacl';
import {
  refreshAccountInfo,
  useAccountInfo,
  useConnection,
} from './connection';
import { createAndInitializeTokenAccount, transferTokens } from './tokens';
import { TOKEN_PROGRAM_ID } from './tokens/instructions';
import {
  ACCOUNT_LAYOUT,
  parseMintData,
  parseTokenAccountData,
} from './tokens/data';
import EventEmitter from 'events';
import { useListener, useLocalStorageState } from './utils';
import { useTokenName } from './tokens/names';

export class Wallet {
  constructor(connection, seed, walletIndex = 0) {
    this.connection = connection;
    this.seed = seed;
    this.walletIndex = walletIndex;
    this.accountCount = 1;
    this.account = this.getAccount(0);

    this.emitter = new EventEmitter();
  }

  static getAccountFromSeed(seed, walletIndex, accountIndex = 0) {
    const derivedSeed = bip32
      .fromSeed(seed)
      .derivePath(`m/501'/${walletIndex}'/0/${accountIndex}`).privateKey;
    return new Account(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
  }

  getAccount = (index) => {
    return Wallet.getAccountFromSeed(this.seed, this.walletIndex, index);
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
    refreshAccountInfo(this.connection, this.getAccount(index).publicKey, true);
    this.emitter.emit('accountCountChange');
  };

  tokenAccountCost = async () => {
    return this.connection.getMinimumBalanceForRentExemption(
      ACCOUNT_LAYOUT.span,
    );
  };

  transferToken = async (index, destination, amount) => {
    let tokenAccount = this.getAccount(index);
    await transferTokens({
      connection: this.connection,
      owner: this.account,
      sourcePublicKey: tokenAccount.publicKey,
      destinationPublicKey: destination,
      amount,
    });
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
  const [walletIndex, setWalletIndex] = useLocalStorageState('walletIndex', 0);
  const wallet = useMemo(
    () => new Wallet(connection, Buffer.from(seed, 'hex'), walletIndex),
    [connection, seed, walletIndex],
  );
  return (
    <WalletContext.Provider
      value={{ wallet, walletIndex, setWalletIndex, seed }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext).wallet;
}

export function useWalletAccountCount() {
  let wallet = useWallet();
  useListener(wallet.emitter, 'accountCountChange');
  return wallet.accountCount;
}

export function useBalanceInfo(index) {
  let wallet = useWallet();
  let publicKey = wallet.getAccount(index).publicKey;
  let [accountInfo, accountInfoLoaded] = useAccountInfo(publicKey);
  let { mint, owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
    ? parseTokenAccountData(accountInfo.data)
    : {};
  let [mintInfo, mintInfoLoaded] = useAccountInfo(mint);
  let { name, symbol } = useTokenName(mint);

  useEffect(() => {
    if (accountInfo && wallet.accountCount < index + 1) {
      wallet.accountCount = index + 1;
      wallet.emitter.emit('accountCountChange');
    }
  }, [wallet, accountInfo, index]);

  if (accountInfoLoaded && mint && mintInfoLoaded) {
    let { decimals } = parseMintData(mintInfo.data);
    return {
      amount,
      decimals,
      mint,
      owner,
      tokenName: name,
      tokenSymbol: symbol,
      initialized: true,
    };
  } else if (accountInfoLoaded && !mint) {
    return {
      amount: accountInfo?.lamports ?? 0,
      decimals: 9,
      mint: null,
      owner: publicKey,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      initialized: false,
    };
  } else {
    return null;
  }
}

export function useWalletSelector() {
  const { walletIndex, setWalletIndex, seed } = useContext(WalletContext);
  const [walletCount, setWalletCount] = useLocalStorageState('walletCount', 1);
  function selectWallet(walletIndex) {
    if (walletIndex >= walletCount) {
      setWalletCount(walletIndex + 1);
    }
    setWalletIndex(walletIndex);
  }
  const addresses = useMemo(() => {
    const seedBuffer = Buffer.from(seed, 'hex');
    return [...Array(walletCount).keys()].map(
      (walletIndex) =>
        Wallet.getAccountFromSeed(seedBuffer, walletIndex).publicKey,
    );
  }, [seed, walletCount]);
  return { addresses, walletIndex, setWalletIndex: selectWallet };
}

export async function mnemonicToSecretKey(mnemonic) {
  const { mnemonicToSeed } = await import('bip39');
  const rootSeed = Buffer.from(await mnemonicToSeed(mnemonic), 'hex');
  const derivedSeed = bip32.fromSeed(rootSeed).derivePath("m/501'/0'/0/0")
    .privateKey;
  return nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
}

import React, { useContext, useMemo } from 'react';
import * as bip32 from 'bip32';
import { Account } from '@solana/web3.js';
import nacl from 'tweetnacl';
import {
  setInitialAccountInfo,
  useAccountInfo,
  useConnection,
} from './connection';
import {
  createAndInitializeTokenAccount,
  getOwnedTokenAccounts,
  transferTokens,
} from './tokens';
import { TOKEN_PROGRAM_ID } from './tokens/instructions';
import {
  ACCOUNT_LAYOUT,
  parseMintData,
  parseTokenAccountData,
} from './tokens/data';
import { useLocalStorageState } from './utils';
import { useTokenName } from './tokens/names';
import { refreshCache, useAsyncData } from './fetch-loop';

export class Wallet {
  constructor(connection, seed, walletIndex = 0) {
    this.connection = connection;
    this.seed = seed;
    this.walletIndex = walletIndex;
    this.account = Wallet.getAccountFromSeed(this.seed, this.walletIndex);
  }

  static getAccountFromSeed(seed, walletIndex, accountIndex = 0) {
    const derivedSeed = bip32
      .fromSeed(seed)
      .derivePath(`m/501'/${walletIndex}'/0/${accountIndex}`).privateKey;
    return new Account(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
  }

  getTokenPublicKeys = async () => {
    let accounts = await getOwnedTokenAccounts(
      this.connection,
      this.account.publicKey,
    );
    return accounts.map(({ publicKey, accountInfo }) => {
      setInitialAccountInfo(this.connection, publicKey, accountInfo);
      return publicKey;
    });
  };

  createTokenAccount = async (tokenAddress) => {
    return await createAndInitializeTokenAccount({
      connection: this.connection,
      payer: this.account,
      mintPublicKey: tokenAddress,
      newAccount: new Account(),
    });
  };

  tokenAccountCost = async () => {
    return this.connection.getMinimumBalanceForRentExemption(
      ACCOUNT_LAYOUT.span,
    );
  };

  transferToken = async (source, destination, amount) => {
    return await transferTokens({
      connection: this.connection,
      owner: this.account,
      sourcePublicKey: source,
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

export function useWalletPublicKeys() {
  let wallet = useWallet();
  let [tokenPublicKeys, loaded] = useAsyncData(
    wallet.getTokenPublicKeys,
    wallet.getTokenPublicKeys,
  );
  let publicKeys = [wallet.account.publicKey, ...(tokenPublicKeys ?? [])];
  return [publicKeys, loaded];
}

export function refreshWalletPublicKeys(wallet) {
  refreshCache(wallet.getTokenPublicKeys);
}

export function useBalanceInfo(publicKey) {
  let [accountInfo, accountInfoLoaded] = useAccountInfo(publicKey);
  let { mint, owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
    ? parseTokenAccountData(accountInfo.data)
    : {};
  let [mintInfo, mintInfoLoaded] = useAccountInfo(mint);
  let { name, symbol } = useTokenName(mint);

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

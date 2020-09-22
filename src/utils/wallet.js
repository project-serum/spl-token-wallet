import React, { useContext, useMemo } from 'react';
import * as bip32 from 'bip32';
import { Account, SystemProgram } from '@solana/web3.js';
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
import { TOKEN_PROGRAM_ID, WRAPPED_SOL_MINT } from './tokens/instructions';
import {
  ACCOUNT_LAYOUT,
  parseMintData,
  parseTokenAccountData,
} from './tokens/data';
import { useListener, useLocalStorageState } from './utils';
import { useTokenName } from './tokens/names';
import { refreshCache, useAsyncData } from './fetch-loop';
import { getUnlockedMnemonicAndSeed, walletSeedChanged } from './wallet-seed';

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

  get publicKey() {
    return this.account.publicKey;
  }

  getTokenAccountInfo = async () => {
    let accounts = await getOwnedTokenAccounts(
      this.connection,
      this.account.publicKey,
    );
    return accounts.map(({ publicKey, accountInfo }) => {
      setInitialAccountInfo(this.connection, publicKey, accountInfo);
      return { publicKey, parsed: parseTokenAccountData(accountInfo.data) };
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

  transferToken = async (source, destination, amount, memo = null) => {
    if (source.equals(this.publicKey)) {
      if (memo) {
        throw new Error('Memo not implemented');
      }
      return this.transferSol(destination, amount);
    }
    return await transferTokens({
      connection: this.connection,
      owner: this.account,
      sourcePublicKey: source,
      destinationPublicKey: destination,
      amount,
      memo,
    });
  };

  transferSol = async (destination, amount) => {
    return await this.connection.sendTransaction(
      SystemProgram.transfer({
        fromPubkey: this.publicKey,
        toPubkey: destination,
        lamports: amount,
      }),
      [this.account],
    );
  };
}

const WalletContext = React.createContext(null);

export function WalletProvider({ children }) {
  useListener(walletSeedChanged, 'change');
  const { mnemonic, seed } = getUnlockedMnemonicAndSeed();
  const connection = useConnection();
  const [walletIndex, setWalletIndex] = useLocalStorageState('walletIndex', 0);
  const wallet = useMemo(
    () =>
      seed
        ? new Wallet(connection, Buffer.from(seed, 'hex'), walletIndex)
        : null,
    [connection, seed, walletIndex],
  );
  return (
    <WalletContext.Provider
      value={{ wallet, walletIndex, setWalletIndex, seed, mnemonic }}
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
  let [tokenAccountInfo, loaded] = useAsyncData(
    wallet.getTokenAccountInfo,
    wallet.getTokenAccountInfo,
  );
  const getPublicKeys = () => [
    wallet.account.publicKey,
    ...(tokenAccountInfo
      ? tokenAccountInfo.map(({ publicKey }) => publicKey)
      : []),
  ];
  const serialized = getPublicKeys()
    .map((pubKey) => pubKey?.toBase58() || '')
    .toString();

  // Prevent users from re-rendering unless the list of public keys actually changes
  let publicKeys = useMemo(getPublicKeys, [serialized]);
  return [publicKeys, loaded];
}

export function useWalletTokenAccounts() {
  let wallet = useWallet();
  return useAsyncData(wallet.getTokenAccountInfo, wallet.getTokenAccountInfo);
}

export function refreshWalletPublicKeys(wallet) {
  refreshCache(wallet.getTokenAccountInfo);
}

export function useBalanceInfo(publicKey) {
  let [accountInfo, accountInfoLoaded] = useAccountInfo(publicKey);
  let { mint, owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
    ? parseTokenAccountData(accountInfo.data)
    : {};
  let [mintInfo, mintInfoLoaded] = useAccountInfo(mint);
  let { name, symbol } = useTokenName(mint);

  if (!accountInfoLoaded) {
    return null;
  }

  if (mint && mint.equals(WRAPPED_SOL_MINT)) {
    return {
      amount,
      decimals: 9,
      mint,
      owner,
      tokenName: 'Wrapped SOL',
      tokenSymbol: 'SOL',
      valid: true,
    };
  }

  if (mint && mintInfoLoaded) {
    try {
      let { decimals } = parseMintData(mintInfo.data);
      return {
        amount,
        decimals,
        mint,
        owner,
        tokenName: name,
        tokenSymbol: symbol,
        valid: true,
      };
    } catch (e) {
      return {
        amount,
        decimals: 0,
        mint,
        owner,
        tokenName: 'Invalid',
        tokenSymbol: 'INVALID',
        valid: false,
      };
    }
  }

  if (!mint) {
    return {
      amount: accountInfo?.lamports ?? 0,
      decimals: 9,
      mint: null,
      owner: publicKey,
      tokenName: 'SOL',
      tokenSymbol: 'SOL',
      valid: true,
    };
  }

  return null;
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
    if (!seed) {
      return [];
    }
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

import React, { useContext, useEffect, useMemo, useState } from 'react';
import * as bs58 from 'bs58';
import { Account, PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import {
  setInitialAccountInfo,
  useAccountInfo,
  useConnection,
} from './connection';
import {
  closeTokenAccount,
  createAndInitializeTokenAccount,
  getOwnedTokenAccounts,
  nativeTransfer,
  transferTokens,
} from './tokens';
import { TOKEN_PROGRAM_ID, WRAPPED_SOL_MINT } from './tokens/instructions';
import {
  ACCOUNT_LAYOUT,
  parseMintData,
  parseTokenAccountData,
} from './tokens/data';
import { useListener, useLocalStorageState, useRefEqual } from './utils';
import { useTokenName } from './tokens/names';
import { refreshCache, useAsyncData } from './fetch-loop';
import { getUnlockedMnemonicAndSeed, walletSeedChanged } from './wallet-seed';
import { WalletProviderFactory } from './walletProvider/factory';
import { getAccountFromSeed } from './walletProvider/localStorage';
import { useSnackbar } from 'notistack';

const DEFAULT_WALLET_SELECTOR = {
  walletIndex: 0,
  importedPubkey: undefined,
  ledger: false,
};

export class Wallet {
  constructor(connection, type, args) {
    this.connection = connection;
    this.type = type;
    this.provider = WalletProviderFactory.getProvider(type, args);
  }

  static create = async (connection, type, args) => {
    const instance = new Wallet(connection, type, args);
    await instance.provider.init();
    return instance;
  };

  get publicKey() {
    return this.provider.publicKey;
  }

  get allowsExport() {
    return this.type === 'local';
  }

  getTokenAccountInfo = async () => {
    let accounts = await getOwnedTokenAccounts(this.connection, this.publicKey);
    return accounts
      .map(({ publicKey, accountInfo }) => {
        setInitialAccountInfo(this.connection, publicKey, accountInfo);
        return { publicKey, parsed: parseTokenAccountData(accountInfo.data) };
      })
      .sort((account1, account2) =>
        account1.parsed.mint
          .toBase58()
          .localeCompare(account2.parsed.mint.toBase58()),
      );
  };

  createTokenAccount = async (tokenAddress) => {
    return await createAndInitializeTokenAccount({
      connection: this.connection,
      payer: this,
      mintPublicKey: tokenAddress,
      newAccount: new Account(),
    });
  };

  tokenAccountCost = async () => {
    return this.connection.getMinimumBalanceForRentExemption(
      ACCOUNT_LAYOUT.span,
    );
  };

  transferToken = async (source, destination, amount, mint, memo = null) => {
    if (source.equals(this.publicKey)) {
      if (memo) {
        throw new Error('Memo not implemented');
      }
      return this.transferSol(destination, amount);
    }
    return await transferTokens({
      connection: this.connection,
      owner: this,
      sourcePublicKey: source,
      destinationPublicKey: destination,
      amount,
      memo,
      mint,
    });
  };

  transferSol = async (destination, amount) => {
    return nativeTransfer(this.connection, this, destination, amount);
  };

  closeTokenAccount = async (publicKey) => {
    return await closeTokenAccount({
      connection: this.connection,
      owner: this,
      sourcePublicKey: publicKey,
    });
  };

  signTransaction = async (transaction) => {
    return this.provider.signTransaction(transaction);
  };

  createSignature = async (message) => {
    return this.provider.createSignature(message);
  };
}

const WalletContext = React.createContext(null);

export function WalletProvider({ children }) {
  useListener(walletSeedChanged, 'change');
  const { mnemonic, seed, importsEncryptionKey } = getUnlockedMnemonicAndSeed();
  const { enqueueSnackbar } = useSnackbar();
  const connection = useConnection();
  const [wallet, setWallet] = useState();

  // `privateKeyImports` are accounts imported *in addition* to HD wallets
  const [privateKeyImports, setPrivateKeyImports] = useLocalStorageState(
    'walletPrivateKeyImports',
    {},
  );
  // `walletSelector` identifies which wallet to use.
  const [walletSelector, setWalletSelector] = useLocalStorageState(
    'walletSelector',
    DEFAULT_WALLET_SELECTOR,
  );
  const [ledgerPubKey, setLedgerPubKey] = useState(
    walletSelector.ledger ? walletSelector.importedPubkey : undefined,
  );

  // `walletCount` is the number of HD wallets.
  const [walletCount, setWalletCount] = useLocalStorageState('walletCount', 1);

  useEffect(() => {
    (async () => {
      if (!seed) {
        return null;
      }
      let wallet;
      if (walletSelector.ledger) {
        try {
          const onDisconnect = () => {
            setWalletSelector(DEFAULT_WALLET_SELECTOR);
            setLedgerPubKey(undefined);
          };
          wallet = await Wallet.create(connection, 'ledger', { onDisconnect });
        } catch (e) {
          console.log(`received error using ledger wallet: ${e}`);
          let message = 'Received error unlocking ledger';
          if (e.statusCode) {
            message += `: ${e.statusCode}`;
          }
          enqueueSnackbar(message, { variant: 'error' });
          setWalletSelector(DEFAULT_WALLET_SELECTOR);
          setLedgerPubKey(undefined);
          return;
        }
      }
      if (!wallet) {
        const account =
          walletSelector.walletIndex !== undefined
            ? getAccountFromSeed(
                Buffer.from(seed, 'hex'),
                walletSelector.walletIndex,
              )
            : new Account(
                (() => {
                  const { nonce, ciphertext } = privateKeyImports[
                    walletSelector.importedPubkey
                  ];
                  return nacl.secretbox.open(
                    bs58.decode(ciphertext),
                    bs58.decode(nonce),
                    importsEncryptionKey,
                  );
                })(),
              );
        wallet = await Wallet.create(connection, 'local', { account });
      }
      setWallet(wallet);
    })();
  }, [
    connection,
    seed,
    walletSelector,
    privateKeyImports,
    importsEncryptionKey,
    setWalletSelector,
    enqueueSnackbar,
  ]);

  function addAccount({ name, importedAccount, ledger }) {
    if (ledger) {
      setLedgerPubKey(importedAccount);
    } else if (importedAccount === undefined) {
      name && localStorage.setItem(`name${walletCount}`, name);
      setWalletCount(walletCount + 1);
    } else {
      const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
      const plaintext = importedAccount.secretKey;
      const ciphertext = nacl.secretbox(plaintext, nonce, importsEncryptionKey);
      // `useLocalStorageState` requires a new object.
      let newPrivateKeyImports = { ...privateKeyImports };
      newPrivateKeyImports[importedAccount.publicKey.toString()] = {
        name,
        ciphertext: bs58.encode(ciphertext),
        nonce: bs58.encode(nonce),
      };
      setPrivateKeyImports(newPrivateKeyImports);
    }
  }

  const getWalletNames = () => {
    return JSON.stringify(
      [...Array(walletCount).keys()].map((idx) =>
        localStorage.getItem(`name${idx}`),
      ),
    );
  };
  const [walletNames, setWalletNames] = useState(getWalletNames());
  function setAccountName(selector, newName) {
    if (selector.importedPubkey && !selector.ledger) {
      let newPrivateKeyImports = { ...privateKeyImports };
      newPrivateKeyImports[selector.importedPubkey.toString()].name = newName;
      setPrivateKeyImports(newPrivateKeyImports);
    } else {
      localStorage.setItem(`name${selector.walletIndex}`, newName);
      setWalletNames(getWalletNames());
    }
  }

  const accounts = useMemo(() => {
    if (!seed) {
      return [];
    }

    const seedBuffer = Buffer.from(seed, 'hex');
    const derivedAccounts = [...Array(walletCount).keys()].map((idx) => {
      let address = getAccountFromSeed(seedBuffer, idx).publicKey;
      let name = localStorage.getItem(`name${idx}`);
      return {
        selector: {
          walletIndex: idx,
          importedPubkey: undefined,
          ledger: false,
        },
        isSelected: walletSelector.walletIndex === idx,
        address,
        name: idx === 0 ? 'Main account' : name || `Account ${idx}`,
      };
    });

    const importedAccounts = Object.keys(privateKeyImports).map((pubkey) => {
      const { name } = privateKeyImports[pubkey];
      return {
        selector: {
          walletIndex: undefined,
          importedPubkey: pubkey,
          ledger: false,
        },
        address: new PublicKey(bs58.decode(pubkey)),
        name: `${name} (imported)`, // TODO: do this in the Component with styling.
        isSelected: walletSelector.importedPubkey === pubkey,
      };
    });

    if (ledgerPubKey) {
      derivedAccounts.push({
        selector: {
          walletIndex: undefined,
          importedPubkey: ledgerPubKey,
          ledger: true,
        },
        address: new PublicKey(ledgerPubKey), // todo: get the ledger address
        name: 'Hardware wallet',
        isSelected: walletSelector.ledger,
      });
    }

    return derivedAccounts.concat(importedAccounts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    seed,
    walletCount,
    walletSelector,
    privateKeyImports,
    walletNames,
    ledgerPubKey,
  ]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        seed,
        mnemonic,
        importsEncryptionKey,
        walletSelector,
        setWalletSelector,
        privateKeyImports,
        setPrivateKeyImports,
        accounts,
        addAccount,
        setAccountName,
      }}
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
  let publicKeys = [
    wallet.publicKey,
    ...(tokenAccountInfo
      ? tokenAccountInfo.map(({ publicKey }) => publicKey)
      : []),
  ];
  // Prevent users from re-rendering unless the list of public keys actually changes
  publicKeys = useRefEqual(
    publicKeys,
    (oldKeys, newKeys) =>
      oldKeys.length === newKeys.length &&
      oldKeys.every((key, i) => key.equals(newKeys[i])),
  );
  return [publicKeys, loaded];
}

export function useWalletTokenAccounts() {
  let wallet = useWallet();
  return useAsyncData(wallet.getTokenAccountInfo, wallet.getTokenAccountInfo);
}

export function refreshWalletPublicKeys(wallet) {
  refreshCache(wallet.getTokenAccountInfo);
}

export function useWalletAddressForMint(mint) {
  const [walletAccounts] = useWalletTokenAccounts();
  return useMemo(
    () =>
      mint
        ? walletAccounts
            ?.find((account) => account.parsed?.mint?.equals(mint))
            ?.publicKey.toBase58()
        : null,
    [walletAccounts, mint],
  );
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
  const {
    accounts,
    addAccount,
    setWalletSelector,
    setAccountName,
  } = useContext(WalletContext);

  return { accounts, setWalletSelector, addAccount, setAccountName };
}

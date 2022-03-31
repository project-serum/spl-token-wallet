import { Connection, PublicKey, AccountInfo } from '@solana/web3.js';
import { parseTokenAccountData, parseMintData } from './data';
import { getTokenInfo, useTokenInfos } from './names';
import { useConnection, useConnectionConfig } from '../connection';
import { useAsyncData } from '../fetch-loop';
import { useState, useEffect } from 'react';
import tuple from 'immutable-tuple';

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);

export const getOwnedTokenAccounts = async (
  connection: Connection,
  publicKey: string,
) => {
  const { value } = await connection.getTokenAccountsByOwner(
    new PublicKey(publicKey),
    {
      programId: TOKEN_PROGRAM_ID,
    },
  );
  return value.map(({ pubkey, account }) => ({
    publicKey: pubkey,
    accountInfo: account,
  }));
};

export const useMultipleAccountsInfo = (
  publicKeys: PublicKey[] | null | undefined,
) => {
  const connection = useConnection();
  const fn = async () => {
    if (!publicKeys) return;
    const result = await connection.getMultipleAccountsInfo(publicKeys);
    return result;
  };
  return useAsyncData(fn, tuple('useMultipleAccountsInfo', publicKeys?.length));
};

export const useMultipleMintInfo = (
  accountInfo: (AccountInfo<Buffer> | null)[] | null | undefined,
) => {
  const connection = useConnection();
  const fn = async () => {
    if (!accountInfo) return null;
    // Can't be null
    const keys = accountInfo.map((e) => new PublicKey(e!.data.slice(0, 32)));
    const result = await connection.getMultipleAccountsInfo(keys);
    return result;
  };
  return useAsyncData(fn, tuple('useMultipleMintInfo', accountInfo?.length));
};

interface BalanceInfo {
  pubkey: PublicKey;
  amount: number;
  decimals: number;
  mint: PublicKey;
  owner: PublicKey | null;
  tokenName: string;
  tokenSymbol: string;
  tokenLogoUri: string | null;
  valid: boolean;
}

export const useSolBalance = (publicKey: PublicKey) => {
  const connection = useConnection();

  const fn = async () => {
    const balance = await connection.getBalance(publicKey);
    return {
      pubkey: publicKey,
      amount: balance,
      decimals: 9,
      mint: null,
      owner: publicKey,
      tokenName: 'SOL',
      tokenSymbol: 'SOL',
      valid: true,
    };
  };
  return useAsyncData(fn, tuple('useSolBalance', publicKey?.toBase58()));
};

export const useMultipleSolBalance = (
  publicKeys: PublicKey[] | null | undefined,
) => {
  const connection = useConnection();
  const fn = async () => {
    if (!publicKeys) return;
    const result = await connection.getMultipleAccountsInfo(publicKeys);

    return result.map((e, idx) => {
      return {
        pubkey: publicKeys[idx],
        amount: e?.lamports || 0,
        decimals: 9,
        mint: null,
        owner: publicKeys[idx],
        tokenName: 'SOL',
        tokenSymbol: 'SOL',
        valid: true,
      };
    });
  };
  return useAsyncData(fn, tuple('useMultipleSolBalance', publicKeys?.length));
};

export const useMultipleBalanceInfo = (
  publicKeys: PublicKey[] | null | undefined,
) => {
  const { endpoint } = useConnectionConfig();
  const tokenInfos = useTokenInfos();
  const [accountsInfo, accountsInfoLoaded] = useMultipleAccountsInfo(
    publicKeys,
  );

  const [mintsInfo, mintsInfoLoaded] = useMultipleMintInfo(accountsInfo);
  const [result, setResult] = useState<BalanceInfo[] | null>(null);

  useEffect(() => {
    const _result: BalanceInfo[] = [];
    const fn = () => {
      if (!publicKeys) return;
      if (!accountsInfoLoaded || !mintsInfoLoaded) return;
      if (!mintsInfo || !accountsInfo) return;
      const len = accountsInfo.length;

      for (let i = 0; i < len; i++) {
        const mintInfo = mintsInfo[i];
        const accountInfo = accountsInfo[i];

        if (!mintInfo) continue;
        if (!accountInfo) continue;

        if (accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
          const { mint, owner, amount } = parseTokenAccountData(
            accountInfo.data,
          );
          const { symbol, logoUri, name } = getTokenInfo(
            mint,
            endpoint,
            tokenInfos,
          );

          try {
            let { decimals } = parseMintData(mintInfo.data);
            _result.push({
              pubkey: publicKeys[i],
              amount,
              decimals,
              mint,
              owner,
              tokenName: name,
              tokenSymbol: symbol,
              tokenLogoUri: logoUri,
              valid: true,
            });
          } catch (err) {
            _result.push({
              pubkey: publicKeys[i],
              amount,
              decimals: 0,
              mint,
              owner,
              tokenName: 'Invalid',
              tokenSymbol: 'INVALID',
              tokenLogoUri: null,
              valid: false,
            });
          }
        }
      }
      setResult(_result);
    };

    fn();
  }, [
    accountsInfoLoaded,
    mintsInfoLoaded,
    accountsInfo?.length,
    mintsInfo?.length,
  ]);

  return result;
};

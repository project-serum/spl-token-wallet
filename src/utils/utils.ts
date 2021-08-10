import { useCallback, useEffect, useRef, useState } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TokenInstructions } from '@project-serum/serum'
import { useMediaQuery } from '@material-ui/core';

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getRandomNumbers = ({
  numberOfNumbers = 4,
  maxNumber = 24,
}: {
  numberOfNumbers?: number;
  maxNumber?: number;
}): number[] => {
  var arr: number[] = [];
  while (arr.length < numberOfNumbers) {
    var r = Math.floor(Math.random() * maxNumber) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
};

export function useLocalStorageState<T>(
  key: string,
  defaultState: T,
): [T, (T) => void] {
  const [state, setState] = useState(() => {
    let storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState) => {
      let changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key],
  );

  return [state, setLocalStorageState];
}

export function useEffectAfterTimeout(effect: () => void, timeout: number) {
  useEffect(() => {
    let handle = setTimeout(effect, timeout);
    return () => clearTimeout(handle);
  });
}

export function useListener(emitter, eventName: string) {
  let [, forceUpdate] = useState(0);
  useEffect(() => {
    let listener = () => forceUpdate((i) => i + 1);
    emitter.on(eventName, listener);
    return () => emitter.removeListener(eventName, listener);
  }, [emitter, eventName]);
}

export function useRefEqual<T>(
  value: T,
  areEqual: (oldValue: T, newValue: T) => boolean,
): T {
  const prevRef = useRef<T>(value);
  if (prevRef.current !== value && !areEqual(prevRef.current, value)) {
    prevRef.current = value;
  }
  return prevRef.current;
}

export function abbreviateAddress(address: PublicKey) {
  let base58 = address.toBase58();
  return base58.slice(0, 4) + '…' + base58.slice(base58.length - 4);
}

export async function confirmTransaction(
  connection: Connection,
  signature: string,
) {
  let startTime = new Date();
  let result = await connection.confirmTransaction(signature, 'recent');
  if (result.value.err) {
    throw new Error(
      'Error confirming transaction: ' + JSON.stringify(result.value.err),
    );
  }
  console.log(
    'Transaction confirmed after %sms',
    new Date().getTime() - startTime.getTime(),
  );
  return result.value;
}

export const formatNumberToUSFormat = (
  numberToFormat: number | string | null,
) => {
  const stringNumber = numberToFormat === null ? '' : numberToFormat.toString();

  return stringNumber.match(/\./g)
    ? stringNumber.replace(/\d(?=(\d{3})+\.)/g, '$&,')
    : stringNumber.replace(/\d(?=(\d{3})+$)/g, '$&,');
};

export const stripDigitPlaces = (
  num: number | string,
  stripToPlaces = 2,
): string | number => {
  const reg = new RegExp(
    `^((\\-|)[0-9]{1,21}\\.[0-9]{0,${stripToPlaces}})|[0-9]{1,21}`,
  );
  const regWithE = /e/g;

  const stringFromNumber = (+num).toString();
  if (regWithE.test(stringFromNumber)) {
    return parseFloat(stringFromNumber).toFixed(stripToPlaces);
  }

  const regResult = stringFromNumber.match(reg);

  let strippedNumber;

  if (regResult !== null && regResult[0].endsWith('.')) {
    strippedNumber = regResult[0].slice(0, regResult[0].length - 1);
  } else {
    strippedNumber = regResult !== null ? regResult[0] : num;
  }

  return strippedNumber;
};

export const isExtension = window.location.protocol === 'chrome-extension:';

export const isExtensionPopup = isExtension && window.opener;

export const walletUrl = window.location.pathname

export const openExtensionInNewTab = () => {
  chrome.tabs.create({
    url: chrome.extension.getURL('index.html#from_extension'),
  });
}
export interface TokenInfo {
  symbol: string
  amount: number
  decimals: number
  mint: string
  address: string
  name: string;
  tokenLogoUri: string
}

export const getAllTokensData = async (
  owner: PublicKey,
  connection: Connection,
  tokenInfos: any,
): Promise<Map<string, TokenInfo>> => {
  const allTokensMap = new Map()

  if (!tokenInfos) return allTokensMap

  const ALL_TOKENS_MINTS_MAP = new Map()

  tokenInfos.forEach(tokenInfo => ALL_TOKENS_MINTS_MAP.set(tokenInfo.address, tokenInfo))

  const [parsedTokenAccounts, solBalance] = await Promise.all([connection.getParsedTokenAccountsByOwner(
    owner,
    { programId: TokenInstructions.TOKEN_PROGRAM_ID }
  ), await connection.getBalance(owner)])

  const SOLToken = {
    symbol: 'SOL',
    amount: solBalance / LAMPORTS_PER_SOL,
    decimals: 9,
    mint: TokenInstructions.WRAPPED_SOL_MINT.toString(),
    address: owner.toString(),
  }

  allTokensMap.set(owner.toString(), SOLToken)

  parsedTokenAccounts.value.forEach((el) => {
    const tokenMintInfo = ALL_TOKENS_MINTS_MAP.get(el.account.data.parsed.info.mint)
    const dataForToken = {
      name: tokenMintInfo
        ? tokenMintInfo.name.replace(' (Sollet)', '')
        : '',
      symbol: tokenMintInfo
        ? tokenMintInfo.symbol
        : abbreviateAddress(new PublicKey(el.account.data.parsed.info.mint)),
      decimals: el.account.data.parsed.info.tokenAmount.decimals,
      amount: el.account.data.parsed.info.tokenAmount.uiAmount,
      mint: el.account.data.parsed.info.mint,
      address: el.pubkey.toString(),
      tokenLogoUri: tokenMintInfo ? tokenMintInfo.logoURI : undefined,
    }

    allTokensMap.set(el.pubkey.toString(), dataForToken)
  })

  return allTokensMap
}

export function useIsExtensionWidth() {
  return useMediaQuery('(max-width:450px)');
}

export const isUSDToken = (token: string): boolean => {
  const upperToken = token.toUpperCase()
  return upperToken === 'USDT' || upperToken === 'USDC' || upperToken === 'WUSDC' || upperToken === 'WUSDT';
}


export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
}

export const extensionUrl = 'https://chrome.google.com/webstore/detail/cryptocurrenciesai-wallet/oomlbhdllfeiglglhhaacafbkkbibhel'

export const encode = (data) => {
  return Object.keys(data)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
    )
    .join('&')
}

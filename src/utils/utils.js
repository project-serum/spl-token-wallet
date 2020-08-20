import { useCallback, useEffect, useState } from 'react';

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useLocalStorageState(key, defaultState = null) {
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

export function useEffectAfterTimeout(effect, timeout) {
  useEffect(() => {
    let handle = setTimeout(effect, timeout);
    return () => clearTimeout(handle);
  });
}

export function useListener(emitter, eventName) {
  let [, forceUpdate] = useState(0);
  useEffect(() => {
    let listener = () => forceUpdate((i) => i + 1);
    emitter.on(eventName, listener);
    return () => emitter.removeListener(eventName, listener);
  }, [emitter, eventName]);
}

export function abbreviateAddress(address) {
  let base58 = address.toBase58();
  return base58.slice(0, 4) + '…' + base58.slice(base58.length - 4);
}

export async function confirmTransaction(connection, signature) {
  let startTime = new Date();
  let result = await Promise.race([
    connection.confirmTransaction(signature, 1).then((result) => result.value),
    new Promise((resolve) => connection.onSignature(signature, resolve)),
  ]);
  if (!result) {
    throw new Error('Failed to confirm transaction');
  }
  if (result.err) {
    throw new Error(
      'Error confirming transaction: ' + JSON.stringify(result.err),
    );
  }
  console.log(
    'Transaction confirmed via %s after %sms',
    result.slot ? 'REST' : 'WS',
    new Date() - startTime,
  );
  return result;
}

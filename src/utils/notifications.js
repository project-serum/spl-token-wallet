import React, { useState } from 'react';
import { notification, Button } from 'antd';
import { useConnection, useSolanaExplorerUrlSuffix } from './connection';
import { confirmTransaction } from './utils';

export function useSendTransaction() {
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const connection = useConnection();
  const [sending, setSending] = useState(false);

  async function sendTransaction(
    signaturePromise,
    { onSuccess, onError } = {},
  ) {
    notify('Sending transaction...', {
      variant: 'info',
      duration: 0,
    });
    setSending(true);
    try {
      let signature = await signaturePromise;
      notification.destroy();
      notify('Confirming transaction...', {
        variant: 'info',
        duration: 0,
        action: (
          <ViewTransactionOnExplorerButton
            signature={signature}
            urlSuffix={urlSuffix}
          />
        ),
      });
      await confirmTransaction(connection, signature);
      setSending(false);
      notification.destroy();
      notify('Transaction confirmed', {
        variant: 'success',
        duration: 15,
        action: (
          <ViewTransactionOnExplorerButton
            signature={signature}
            urlSuffix={urlSuffix}
          />
        ),
      });
      if (onSuccess) {
        onSuccess(signature);
      }
    } catch (e) {
      setSending(false);
      console.warn(e.message);
      notification.destroy();
      notify(e.message, { variant: 'error' });
      if (onError) {
        onError(e);
      }
    }
  }

  return [sendTransaction, sending];
}

function ViewTransactionOnExplorerButton({ signature, urlSuffix }) {
  return (
    <Button
      type="link"
      component="a"
      target="_blank"
      rel="noopener"
      href={`https://explorer.solana.com/tx/${signature}` + urlSuffix}
    >
      View on Solana Explorer
    </Button>
  );
}

export function useCallAsync() {
  return async function callAsync(
    promise,
    {
      progressMessage = 'Submitting...',
      successMessage = 'Success',
      onSuccess,
      onError,
    } = {},
  ) {
    notify(progressMessage, {
      variant: 'info',
      persist: true,
    });
    try {
      let result = await promise;
      if (successMessage) {
        notify(successMessage, { variant: 'success' });
      }
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (e) {
      console.warn(e);
      notify(e.message, { variant: 'error' });
      if (onError) {
        onError(e);
      }
    }
  };
}

export function notify(
  message,
  params = { variant: 'info', duration: 4 },
  placement = 'bottomLeft',
) {
  const { description, variant, duration, action } = params;
  notification[variant]({
    message: <span style={{ color: 'black' }}>{message}</span>,
    description: action || (
      <span style={{ color: 'black', opacity: 0.5 }}>{description}</span>
    ),
    duration,
    placement,
    style: {
      backgroundColor: 'white',
    },
  });
}

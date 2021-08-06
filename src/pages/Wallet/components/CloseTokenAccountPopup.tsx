import React from 'react';
import DialogForm from './DialogForm';
import { DialogContentText, useTheme } from '@material-ui/core';
import {
  RedFilledButton,
  RowContainer,
  Title,
  WhiteButton,
} from '../../commonStyles';
import { abbreviateAddress } from '../../../utils/utils';
import { useSendTransaction } from '../../../utils/notifications';
import { refreshWalletPublicKeys, useWallet } from '../../../utils/wallet';

export default function CloseTokenAccountDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
  refreshTokensData,
}) {
  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const theme = useTheme();

  const { mint, symbol } = balanceInfo || { mint: '', symbol: '' };

  console.log('balanceInfo', balanceInfo);

  function onSubmit() {
    sendTransaction(wallet.closeTokenAccount(publicKey), {
      onSuccess: () => {
        refreshWalletPublicKeys(wallet);
        refreshTokensData()
        onClose();
      },
    });
  }

  return (
    <DialogForm
      open={open}
      onClose={onClose}
      fullWidth
      height="auto"
      padding="2rem 0"
      onSubmit={onSubmit}
    >
      <RowContainer width="90%" direction="column">
        <RowContainer justify="flex-start" margin="0 0 2rem 0">
          <Title fontSize="2.4rem">
            Delete {symbol ?? mint} Address {abbreviateAddress(publicKey)}
          </Title>
        </RowContainer>
        <RowContainer>
          <DialogContentText>
            Are you sure you want to delete your {symbol ?? mint} address{' '}
            {publicKey.toBase58()}? This will permanently disable token
            transfers to this address and remove it from your wallet.
          </DialogContentText>
        </RowContainer>
        <RowContainer margin="2rem 0 0 0" justify="space-between">
          <WhiteButton
            theme={theme}
            width={'calc(50% - .5rem)'}
            onClick={onClose}
          >
            Close
          </WhiteButton>
          <RedFilledButton
            theme={theme}
            onClick={onSubmit}
            width={'calc(50% - .5rem)'}
            disabled={sending}
          >
            Delete
          </RedFilledButton>
        </RowContainer>
      </RowContainer>
    </DialogForm>
  );
}

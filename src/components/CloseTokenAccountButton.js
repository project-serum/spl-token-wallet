import DialogForm from './DialogForm';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogContentText } from '@material-ui/core';
import { abbreviateAddress } from '../utils/utils';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSendTransaction } from '../utils/notifications';
import { refreshWalletPublicKeys, useWallet } from '../utils/wallet';

export default function CloseTokenAccountDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const { t } = useTranslation();
  const { mint, tokenName } = balanceInfo;

  function onSubmit() {
    sendTransaction(wallet.closeTokenAccount(publicKey), {
      onSuccess: () => {
        refreshWalletPublicKeys(wallet);
        onClose();
      },
    });
  }

  return (
    <DialogForm open={open} onClose={onClose} onSubmit={onSubmit}>
      <DialogTitle>
        {t("delete_title", { tokenName: tokenName ?? mint.toBase58(), address: abbreviateAddress(publicKey) })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("delete_description", { tokenName: tokenName ?? mint.toBase58(), address: publicKey.toBase58() })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button type="submit" color="secondary" disabled={sending}>
          {t("delete")}
        </Button>
      </DialogActions>
    </DialogForm>
  );
}

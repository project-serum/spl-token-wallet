import React from 'react';
import { useTranslation } from 'react-i18next';
import DialogForm from './DialogForm';
import { forgetWallet } from '../utils/wallet-seed';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContentText } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export default function DeleteAccountDialog({
  open,
  onClose,
  isDeleteAccountEnabled,
}) {
  const { t } = useTranslation();
  return (
    <>
      <DialogForm
        open={open}
        onClose={onClose}
        onSubmit={() => {
          forgetWallet();
          onClose();
        }}
        fullWidth
      >
        <DialogTitle>{t("delete_account")}</DialogTitle>
        <DialogContentText style={{ margin: 20 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {t("delete_message")}
            <br />
            <br />
            <strong style={{ textAlign: 'center' }}>
              {t("delete_message_strong")}
            </strong>
          </div>
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose}>{t("close")}</Button>
          <Button
            type="submit"
            color="secondary"
            disabled={!isDeleteAccountEnabled}
          >
            {t("delete_account")}
          </Button>
        </DialogActions>
      </DialogForm>
    </>
  );
}

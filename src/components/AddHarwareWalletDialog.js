import React, { useEffect, useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogForm from './DialogForm';
import { LedgerWalletProvider } from '../utils/walletProvider/ledger';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

export default function AddHardwareWalletDialog({ open, onAdd, onClose }) {
  const [pubKey, setPubKey] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      if (open) {
        try {
          const provider = new LedgerWalletProvider();
          await provider.init();
          setPubKey(provider.publicKey);
        } catch (err) {
          console.log(
            `received error when attempting to connect ledger: ${err}`,
          );
          if (err.statusCode === 0x6804) {
            enqueueSnackbar('Unlock ledger device', { variant: 'error' });
          }
          setPubKey(undefined);
          onClose();
        }
      }
    })();
  }, [open, onClose, enqueueSnackbar]);

  return (
    <DialogForm
      open={open}
      onEnter={() => {}}
      onClose={() => {
        setPubKey(undefined);
        onClose();
      }}
      onSubmit={() => {
        setPubKey(undefined);
        onAdd(pubKey);
        onClose();
      }}
      fullWidth
    >
      <DialogTitle>{t("add_hardware_wallet")}</DialogTitle>
      <DialogContent style={{ paddingTop: 16 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {pubKey ? (
            <>
              <b>{t("hardware_wallet_detected")}</b>
              <div>{pubKey.toString()}</div>
            </>
          ) : (
            <>
              <b>{t("connect_ledger_solana_app")}</b>
              <CircularProgress />
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setPubKey(undefined);
            onClose();
          }}
        >
          {t("close")}
        </Button>
        <Button type="submit" color="primary" disabled={!pubKey}>
          {t("add")}
        </Button>
      </DialogActions>
    </DialogForm>
  );
}

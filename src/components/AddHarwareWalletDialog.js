import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import DialogForm from './DialogForm';
import { LedgerWalletProvider } from '../utils/walletProvider/ledger';
import {
  AccountsSelector,
  DerivationPathMenuItem,
  toDerivationPath,
} from '../pages/LoginPage.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

export default function AddHardwareWalletDialog({ open, onAdd, onClose }) {
  const [showAccounts, setShowAccounts] = useState(false);
  return (
    <DialogForm onClose={onClose} open={open} onEnter={() => {}} fullWidth>
      {showAccounts ? (
        <LedgerAccounts onAdd={onAdd} open={open} onClose={onClose} />
      ) : (
        <AddHardwareWalletSplash
          onClose={onClose}
          onAccept={() => setShowAccounts(true)}
        />
      )}
    </DialogForm>
  );
}

function AddHardwareWalletSplash({ onAccept, onClose }) {
  return (
    <>
      <DialogTitle>Add hardware wallet</DialogTitle>
      <DialogContent style={{ paddingTop: 16 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <b>
            Connect your ledger and open the Solana application. When you are
            ready, click "continue".
          </b>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={onAccept}>
          Continue
        </Button>
      </DialogActions>
    </>
  );
}

function LedgerAccounts({ onAdd, onClose, open }) {
  const [dPathMenuItem, setDPathMenuItem] = useState(
    DerivationPathMenuItem.Bip44Root,
  );
  const { enqueueSnackbar } = useSnackbar();
  const [accounts, setAccounts] = useState(null);
  const onClick = (provider) => {
    onAdd({
      publicKey: provider.pubKey,
      derivationPath: provider.derivationPath,
      account: provider.account,
      change: provider.change,
    });
    onClose();
  };
  useEffect(() => {
    if (open) {
      const fetch = async () => {
        let accounts = [];
        if (dPathMenuItem === DerivationPathMenuItem.Bip44Root) {
          let provider = new LedgerWalletProvider({
            derivationPath: toDerivationPath(dPathMenuItem),
          });
          accounts.push(await provider.init());
        } else {
          setAccounts(null);
          // Loading in parallel makes the ledger upset. So do it serially.
          for (let k = 0; k < 10; k += 1) {
            let provider = new LedgerWalletProvider({
              derivationPath: toDerivationPath(dPathMenuItem),
              account: k,
            });
            accounts.push(await provider.init());
          }
        }
        setAccounts(accounts);
      };
      fetch().catch((err) => {
        console.log(`received error when attempting to connect ledger: ${err}`);
        if (err && err.statusCode === 0x6804) {
          enqueueSnackbar('Unlock ledger device', { variant: 'error' });
        }
        onClose();
      });
    }
  }, [dPathMenuItem, enqueueSnackbar, open, onClose]);
  return (
    <Card elevation={0}>
      {accounts === null ? (
        <div style={{ padding: '24px' }}>
          <Typography align="center">
            Loading accounts from your hardware wallet
          </Typography>
          <CircularProgress
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        </div>
      ) : (
        <AccountsSelector
          showRoot={true}
          onClick={onClick}
          accounts={accounts}
          setDPathMenuItem={setDPathMenuItem}
          dPathMenuItem={dPathMenuItem}
        />
      )}
    </Card>
  );
}

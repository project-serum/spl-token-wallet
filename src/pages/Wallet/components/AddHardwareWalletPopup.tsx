import React, { useEffect, useState } from 'react';
import DialogForm from './DialogForm';
import { LedgerWalletProvider } from '../../../utils/walletProvider/ledger';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import {
  Card,
  RowContainer,
  Title,
  VioletButton,
  WhiteButton,
} from '../../commonStyles';
import { FormControl, Select, MenuItem, useTheme } from '@material-ui/core';
import { DERIVATION_PATH } from '../../../utils/walletProvider/localStorage';
import { BalanceListItem } from '../../../components/BalancesList';

const AddHardwareView = {
  Splash: 0,
  Accounts: 1,
  Confirm: 2,
};

export const DerivationPathMenuItem = {
  Deprecated: 0,
  Bip44: 1,
  Bip44Change: 2,
  Bip44Root: 3, // Ledger only.
};

export function toDerivationPath(dPathMenuItem) {
  switch (dPathMenuItem) {
    case DerivationPathMenuItem.Deprecated:
      return DERIVATION_PATH.deprecated;
    case DerivationPathMenuItem.Bip44:
      return DERIVATION_PATH.bip44;
    case DerivationPathMenuItem.Bip44Change:
      return DERIVATION_PATH.bip44Change;
    case DerivationPathMenuItem.Bip44Root:
      return DERIVATION_PATH.bip44Root;
    default:
      throw new Error(`invalid derivation path: ${dPathMenuItem}`);
  }
}

export default function AddHardwareWalletDialog({ open, onAdd, onClose }) {
  const [view, setView] = useState(AddHardwareView.Splash);
  const [hardwareAccount, setHardwareAccount] = useState(null);
  return (
    <DialogForm height="auto"
    padding="2rem 0" onClose={onClose} open={open} onEnter={() => {}} fullWidth>
      {view === AddHardwareView.Splash ? (
        <AddHardwareWalletSplash
          onClose={onClose}
          onContinue={() => setView(AddHardwareView.Accounts)}
        />
      ) : view === AddHardwareView.Accounts ? (
        <LedgerAccounts
          onContinue={(account) => {
            setHardwareAccount(account);
            setView(AddHardwareView.Confirm);
          }}
          open={open}
          onClose={onClose}
        />
      ) : (
        <ConfirmHardwareWallet
          account={hardwareAccount}
          onDone={() => {
            onAdd(hardwareAccount);
            onClose();
            setView(AddHardwareView.Splash);
          }}
          onBack={() => {
            setView(AddHardwareView.Accounts);
          }}
        />
      )}
    </DialogForm>
  );
}

function ConfirmHardwareWallet({ account, onDone, onBack }) {
  const [didConfirm, setDidConfirm] = useState(false);
  const theme = useTheme()
  useEffect(() => {
    if (!didConfirm) {
      account.provider
        .confirmPublicKey()
        .then(() => setDidConfirm(true))
        .catch((err) => {
          console.error('Error confirming', err);
          onBack();
        });
    }
  });
  return (
    <>
      <RowContainer>
        <Title>Confirm your wallet address</Title>
      </RowContainer>
      <RowContainer direction="column">
        <RowContainer direction="column" margin="2rem 0">
              <Title>Check your ledger and confirm the address displayed is the address
            chosen. Then click "done".</Title>
              <RowContainer margin="1rem 0">
                <Title>{account.publicKey.toString()}</Title>
              </RowContainer>
        </RowContainer>
        <RowContainer justify="space-between" width="90%">
          <WhiteButton
            theme={theme}
            width="calc(50% - .5rem)"
            onClick={onBack}
          >
            Close
          </WhiteButton>
          <VioletButton
            width="calc(50% - .5rem)"
            theme={theme}
            type="submit"
            color="primary"
            disabled={!didConfirm}
            onClick={onDone}
          >
            Add
          </VioletButton>
        </RowContainer>
      </RowContainer>
    </>
  );
}



function AddHardwareWalletSplash({ onContinue, onClose }) {
  const theme = useTheme()
  return (
    <RowContainer direction="column" width="90%">
            <RowContainer >
        <Title style={{ fontSize: '2.4rem' }}>Confirm your wallet address</Title>
      </RowContainer>
      <RowContainer margin="2rem 0 0 0">
        <RowContainer
        >
          <Title>
            Connect your ledger and open the Solana application. When you are
            ready, click "continue".
          </Title>
        </RowContainer>
      </RowContainer>
      <RowContainer margin="2rem 0 0 0" justify="space-between" >
          <WhiteButton
            theme={theme}
            width="calc(50% - .5rem)"
            onClick={onClose}
          >
            Close
          </WhiteButton>
          <VioletButton
            width="calc(50% - .5rem)"
            theme={theme}
            type="submit"
            color="primary"
            onClick={onContinue}
          >
            Continue
          </VioletButton>
        </RowContainer>
    </RowContainer>
  );
}

export function AccountsSelector({
  showRoot,
  showDeprecated,
  accounts,
  dPathMenuItem,
  setDPathMenuItem,
  onClick,
}) {
  return (
    <Card>
      <RowContainer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Title variant="h5" gutterBottom>
          Derivable Accounts
        </Title>
        <FormControl variant="outlined">
          <Select
            value={dPathMenuItem}
            onChange={(e) => {
              setDPathMenuItem(e.target.value);
            }}
          >
            {showRoot && (
              <MenuItem value={DerivationPathMenuItem.Bip44Root}>
                {`m/44'/501'`}
              </MenuItem>
            )}
            <MenuItem value={DerivationPathMenuItem.Bip44}>
              {`m/44'/501'/0'`}
            </MenuItem>
            <MenuItem value={DerivationPathMenuItem.Bip44Change}>
              {`m/44'/501'/0'/0'`}
            </MenuItem>
            {showDeprecated && (
              <MenuItem value={DerivationPathMenuItem.Deprecated}>
                {`m/501'/0'/0/0 (deprecated)`}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </RowContainer>
      {accounts.map((acc) => {
        return (
          // @ts-ignore
          <div onClick={onClick ? () => onClick(acc) : {}}>
            <BalanceListItem
              key={acc.publicKey.toString()}
              expandable={false}
              // @ts-ignore
              onClick={onClick}
              publicKey={acc.publicKey}
            />
          </div>
        );
      })}
    </Card>
  );
}

function LedgerAccounts({ onContinue, onClose, open }) {
  const [dPathMenuItem, setDPathMenuItem] = useState(
    DerivationPathMenuItem.Bip44Root,
  );
  const { enqueueSnackbar } = useSnackbar();
  const [accounts, setAccounts] = useState(null);
  const onClick = (provider) => {
    onContinue({
      provider,
      publicKey: provider.pubKey,
      derivationPath: provider.derivationPath,
      account: provider.account,
      change: provider.change,
    });
  };
  useEffect(() => {
    if (open) {
      const fetch = async () => {
        let accounts: any = [];
        if (dPathMenuItem === DerivationPathMenuItem.Bip44Root) {
          let provider = new LedgerWalletProvider({
            derivationPath: toDerivationPath(dPathMenuItem),
          });
                      // @ts-ignore

          accounts.push(await provider.init());
        } else {
          setAccounts(null);
          // Loading in parallel makes the ledger upset. So do it serially.
          for (let k = 0; k < 10; k += 1) {
            let provider = new LedgerWalletProvider({
              derivationPath: toDerivationPath(dPathMenuItem),
              account: k,
            });
            // @ts-ignore
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
          <Title align="center">
            Loading accounts from your hardware wallet
          </Title>
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
          showDeprecated={true}
          onClick={onClick}
          accounts={accounts}
          setDPathMenuItem={setDPathMenuItem}
          dPathMenuItem={dPathMenuItem}
        />
      )}
    </Card>
  );
}
import React, { useEffect, useState } from 'react';
import DialogForm from './DialogForm';
import { LedgerWalletProvider } from '../../../utils/walletProvider/ledger';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { PublicKey } from '@solana/web3.js';
import {
  RowContainer,
  Title,
  VioletButton,
  WhiteButton,
} from '../../commonStyles';
import { useTheme } from '@material-ui/core';

export default function AddHardwareWalletDialog({ open, onAdd, onClose }) {
  const [pubKey, setPubKey] = useState<undefined | PublicKey>(undefined);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      if (open) {
        try {
          const provider = new LedgerWalletProvider();
          await provider.init();
          setPubKey(provider?.publicKey);
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
      height="25rem"
      open={open}
      onEnter={() => {}}
      onClose={() => {
        setPubKey(undefined);
        onClose();
      }}
      fullWidth
    >
      <RowContainer>
        <Title>Add hardware wallet</Title>
      </RowContainer>
      <RowContainer direction="column">
        <RowContainer direction="column" margin="2rem 0">
          {pubKey ? (
            <>
              <Title>Hardware wallet detected:</Title>
              <Title>{pubKey?.toString()}</Title>
            </>
          ) : (
            <>
              <Title>Connect your ledger and open the Solana application</Title>
              <RowContainer margin="1rem 0">
                <CircularProgress />
              </RowContainer>
            </>
          )}
        </RowContainer>
        <RowContainer justify="space-between" width="90%">
          <WhiteButton
            theme={theme}
            width="calc(50% - .5rem)"
            onClick={() => {
              setPubKey(undefined);
              onClose();
            }}
          >
            Close
          </WhiteButton>
          <VioletButton
            width="calc(50% - .5rem)"
            theme={theme}
            type="submit"
            color="primary"
            disabled={!pubKey}
            onClick={() => {
              setPubKey(undefined);
              onAdd(pubKey);
              onClose();
            }}
          >
            Add
          </VioletButton>
        </RowContainer>
      </RowContainer>
    </DialogForm>
  );
}

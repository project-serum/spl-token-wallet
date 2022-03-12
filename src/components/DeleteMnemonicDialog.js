import React, { useState } from 'react';
import DialogForm from './DialogForm';
import { forgetWallet, normalizeMnemonic, useUnlockedMnemonicAndSeed } from '../utils/wallet-seed';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContentText, Box, Typography } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function DeleteMnemonicDialog({ open, onClose }) {
  const [seedCheck, setSeedCheck] = useState('');
  const [mnemKey] = useUnlockedMnemonicAndSeed();
  return (
    <>
      <DialogForm
        open={open}
        onClose={onClose}
        maxWidth='xs'
        onSubmit={() => {
          forgetWallet();
          onClose();
        }}
        fullWidth
      >
        <DialogTitle>{'Delete Mnemonic & Log Out'}</DialogTitle>
        <DialogContentText>
          <Box align="center" my={2}>
            <Typography variant="paragraph" >
              <b>This action will delete all current accounts from your browser.</b>
            </Typography>
            <br/>
            <Typography variant="paragraph">
              You will not be able to recover the current accounts without the
              seed phrase, and the account private key.
            </Typography>            
          </Box>
          <Box align="center" my={2}>
            <Typography variant="paragraph">
                To prevent loss of funds, please ensure you have the seed phrase
                and the private key for all current accounts. You can view it by selecting
                "Export Mnemonic" in the user menu.
            </Typography>
          </Box>
          <TextField
            label={`Please type your seed phrase to confirm`}
            fullWidth
            variant="outlined"
            margin="normal"
            value={seedCheck}
            multiline
            rows={4}
            onChange={(e) => setSeedCheck(e.target.value)}
          />
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            type="submit"
            color="secondary"
            disabled={normalizeMnemonic(seedCheck) !== mnemKey.mnemonic}
          >
            Delete
          </Button>
        </DialogActions>
      </DialogForm>
    </>
  );
}

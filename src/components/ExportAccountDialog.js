import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import * as bs58 from 'bs58';
import DialogForm from './DialogForm';
import { useWallet } from '../utils/wallet';

export default function ExportAccountDialog({ open, onClose }) {
  const wallet = useWallet();
  const [isHidden, setIsHidden] = useState(true);
  const [isArrayFormat, setArrayFormat] = useState(false);

  const keyOutput = isArrayFormat
    ? `[${Array.from(wallet.provider.account.secretKey)}]`
    : bs58.encode(wallet.provider.account.secretKey);

  return (
    <DialogForm open={open} onClose={onClose} fullWidth>
      <DialogTitle>Export account</DialogTitle>
      <DialogContent>
        <TextField
          label="Private key"
          fullWidth
          type={isHidden && 'password'}
          variant="outlined"
          margin="normal"
          value={keyOutput}
        />
        {isArrayFormat && <p>Developer feature - array format cannot be imported directly.</p>}
        <FormControlLabel
          control={
            <Switch
              checked={isArrayFormat}
              onChange={() => setArrayFormat(!isArrayFormat)}
            />
          }
          label="Array Format"
        />
        <FormControlLabel
          control={
            <Switch
              checked={!isHidden}
              onChange={() => setIsHidden(!isHidden)}
            />
          }
          label="Reveal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </DialogForm>
  );
}

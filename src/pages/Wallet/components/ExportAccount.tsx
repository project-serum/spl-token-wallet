import React, { useState } from 'react';
import copy from 'clipboard-copy';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DialogForm from './DialogForm';
import { useWallet } from '../../../utils/wallet';
import { getUnlockedMnemonicAndSeed } from '../../../utils/wallet-seed';
import { RowContainer, Title } from '../../commonStyles';
import { TextareaWithCopy } from '../../../components/Input';

export default function ExportAccountDialog({ open, onClose }) {
  const wallet = useWallet();
  const [isHidden, setIsHidden] = useState(true);
  const keyOutput = `[${Array.from(wallet.provider.account.secretKey)}]`;
  return (
    <DialogForm open={open} onClose={onClose} fullWidth onSubmit={() => {}}>
      <DialogTitle>Export account</DialogTitle>
      <DialogContent>
        <TextField
          label="Private key"
          fullWidth
          type={isHidden ? 'password' : 'text'}
          variant="outlined"
          margin="normal"
          value={keyOutput}
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

export function ExportMnemonicDialog({ open, onClose }) {
  // for export no need for password
  // const [isHidden, setIsHidden] = useState(true);
  const mnemKey = getUnlockedMnemonicAndSeed();
  return (
    <DialogForm open={open} onClose={onClose} height="20rem" fullWidth onSubmit={() => {}}>
      <RowContainer width="90%" justify="flex-start" margin="2rem 0">
        <Title>Your mnemonic:</Title>
      </RowContainer>
      <RowContainer width="90%">
        <TextareaWithCopy
          value={mnemKey.mnemonic}
          onChange={() => {}}
          onCopyClick={() => copy(mnemKey.mnemonic)}
          height={'11.5rem'}
          type={'text'}
          placeholder={''}
        />
      </RowContainer>
    </DialogForm>
  );
}

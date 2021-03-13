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
import {
  loadMnemonicAndSeed,
} from '../../../utils/wallet-seed';
import { Row, RowContainer, Title, VioletButton } from '../../commonStyles';
import { InputWithEye, TextareaWithCopy } from '../../../components/Input';
import { useTheme } from '@material-ui/core';
import { useCallAsync } from '../../../utils/notifications';

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
  const [isHidden, setIsHidden] = useState(true);
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const theme = useTheme();
  const callAsync = useCallAsync();

  return (
    <DialogForm
      open={open}
      onClose={onClose}
      height="30rem"
      fullWidth
      onEnter={() => {
        setMnemonic('')
        setPassword('')
      }}
    >
      <RowContainer width="90%" justify="flex-start" margin="2rem 0">
        <Title>Enter your password to unlock the seed phrase</Title>
      </RowContainer>

      <RowContainer width="90%" justify={'space-between'} margin="0 0 2rem 0">
        <Row width="calc(70% -.5rem)">
          <InputWithEye
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={'Password'}
            onEyeClick={() => setIsHidden(!isHidden)}
            type={isHidden ? 'password' : 'text'}
            showPassword={!isHidden}
            containerStyle={{ width: '100%' }}
          />
        </Row>
        <VioletButton
          theme={theme}
          width={'calc(30% - .5rem)'}
          onClick={() => {
            callAsync(loadMnemonicAndSeed(password, false), {
              progressMessage: 'Unlocking wallet...',
              successMessage: 'Wallet unlocked',
              onSuccess: (res) => {
                setMnemonic(res.mnemonic);
              },
              onError: () => {},
            });
          }}
        >
          Confirm
        </VioletButton>
      </RowContainer>

      <RowContainer width="90%">
        <TextareaWithCopy
          value={mnemonic}
          onChange={() => {}}
          onCopyClick={() => copy(mnemonic)}
          height={'11.5rem'}
          type={'text'}
          placeholder={'***'}
        />
      </RowContainer>
    </DialogForm>
  );
}

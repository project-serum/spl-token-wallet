import React, { useState } from 'react';
import { Account } from '@solana/web3.js';
import DialogForm from './DialogForm';
import {
  Input,
  RowContainer,
  StyledCheckbox,
  StyledLabel,
  Title,
  VioletButton,
  WhiteButton,
} from '../../commonStyles';
import { useTheme } from '@material-ui/core';
import { InputWithPaste } from '../../../components/Input';

export default function AddAccountDialog({ open, onAdd, onClose }) {
  const [name, setName] = useState('');
  const [isImport, setIsImport] = useState(false);
  const [importedPrivateKey, setPrivateKey] = useState('');

  const importedAccount = isImport
    ? decodeAccount(importedPrivateKey)
    : undefined;
  const isAddEnabled = isImport ? name && importedAccount !== undefined : name;

  const theme = useTheme();

  return (
    <DialogForm
      height="30rem"
      open={open}
      onEnter={() => {
        setName('');
        setIsImport(false);
        setPrivateKey('');
      }}
      onClose={onClose}
      fullWidth
    >
      <RowContainer>
        <Title fontSize="2rem">Add account</Title>
      </RowContainer>
      <RowContainer direction="column">
        <RowContainer direction="column">
          <RowContainer width="90%" margin="2rem 0">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </RowContainer>
          <RowContainer>
            <StyledCheckbox
              theme={theme}
              id={'isImport'}
              checked={isImport}
              onChange={() => setIsImport(!isImport)}
            />
            <StyledLabel htmlFor="isImport">Import private key</StyledLabel>
          </RowContainer>
          {isImport && (
            <RowContainer margin="2rem 0 0 0">
              <InputWithPaste
                placeholder="Paste your private key here"
                type="password"
                value={importedPrivateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                onPasteClick={() => navigator.clipboard
                    .readText()
                    .then((clipText) => setPrivateKey(clipText))
                }
              />
            </RowContainer>
          )}
        </RowContainer>
        <RowContainer width="90%" justify="space-between" margin="2rem 0 0 0">
          <WhiteButton theme={theme} onClick={onClose}>
            Close
          </WhiteButton>
          <VioletButton
            theme={theme}
            type="submit"
            color="primary"
            disabled={!isAddEnabled}
            onClick={() => onAdd({ name, importedAccount })}
          >
            Add
          </VioletButton>
        </RowContainer>
      </RowContainer>
    </DialogForm>
  );
}

/**
 * Returns an account object when given the private key
 *
 * @param {string} privateKey - the private key in array format
 */
function decodeAccount(privateKey) {
  try {
    const a = new Account(JSON.parse(privateKey));
    return a;
  } catch (_) {
    return undefined;
  }
}

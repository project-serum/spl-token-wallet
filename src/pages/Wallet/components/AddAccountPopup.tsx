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
import FakeInputs from '../../../components/FakeInputs';

export default function AddAccountDialog({ open, onAdd, onClose }) {
  const [name, setName] = useState('');
  const [isImport, setIsImport] = useState(false);
  const [importedPrivateKey, setPrivateKey] = useState('');

  const importedAccount = isImport
    ? decodeAccount(importedPrivateKey)
    : undefined;

  const isDisabled = isImport ? !name || !importedAccount || name.length > 16 : !name || name.length > 16;

  const theme = useTheme();
  const submit = () => onAdd({ name, importedAccount })

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isDisabled) {
      submit();
    }
  };

  return (
    <DialogForm
      height="auto"
      padding="2rem 0"
      open={open}
      onEnter={() => {
        setName('');
        setIsImport(false);
        setPrivateKey('');
      }}
      onClose={onClose}
      fullWidth
    >
      <FakeInputs />
      <RowContainer>
        <Title fontSize="2rem">Add account</Title>
      </RowContainer>
      <RowContainer width="90%" direction="column">
        <RowContainer direction="column">
          <RowContainer margin="2rem 0">
            <Input
              placeholder="Name"
              value={name}
              onKeyDown={handleKeyDown}
              onChange={(e) => setName(e.target.value)}
            />
          </RowContainer>
          {name.length > 16 && (
              <RowContainer width="90%" margin="2rem 0 0 0">
                <Title color={theme.customPalette.red.main}>
                  Sorry, your account name shouldn't be longer than 16 symbols
                </Title>
              </RowContainer>
            )}
          <RowContainer justify="flex-start">
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
                onKeyDown={handleKeyDown}
                containerStyle={{ width: '100%' }}
                onChange={(e) => setPrivateKey(e.target.value)}
                onPasteClick={() =>
                  navigator.clipboard
                    .readText()
                    .then((clipText) => setPrivateKey(clipText))
                }
              />
            </RowContainer>
          )}
        </RowContainer>
        <RowContainer justify="space-between" margin="2rem 0 0 0">
          <WhiteButton theme={theme} onClick={onClose}>
            Close
          </WhiteButton>
          <VioletButton
            theme={theme}
            type="submit"
            color="primary"
            disabled={isDisabled}
            onClick={() => submit()}
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

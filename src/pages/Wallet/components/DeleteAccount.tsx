import React, { useState } from 'react';
import DialogForm from './DialogForm';
import { forgetWallet } from '../../../utils/wallet-seed';
import {
  Input,
  RowContainer,
  Title,
  VioletButton,
  WhiteButton,
} from '../../commonStyles';
import { useTheme } from '@material-ui/core';

export default function DeleteMnemonicDialog({ open, onClose }) {
  const [deleteCheck, setDeleteCheck] = useState('');
  const theme = useTheme();

  return (
    <>
      <DialogForm
        open={open}
        onClose={onClose}
        fullWidth
      >
        <RowContainer direction="column" margin="0 0 2rem 0">
          <Title fontSize="2rem">Delete Mnemonic</Title>
        </RowContainer>
        <RowContainer direction="column">
          <RowContainer direction="column" width="90%">
            <Title>
              You will not be able to recover the current accounts without the
              seed phrase, and the account private key. This action will delete
              all current accounts from your browser.
            </Title>
            <br />
            <br />
            <Title>
              To prevent loss of funds, please ensure you have the seed phrase
              and the private key for all current accounts.
            </Title>
          </RowContainer>
          <RowContainer width="90%" margin="2rem 0">
            <Input
              placeholder={`Please type "delete" to confirm`}
              value={deleteCheck}
              onChange={(e) => setDeleteCheck(e.target.value)}
            />
          </RowContainer>
          <RowContainer width="90%" justify="space-between">
            <WhiteButton
              theme={theme}
              width={'calc(50% - .5rem)'}
              onClick={onClose}
            >
              Close
            </WhiteButton>
            <VioletButton
              theme={theme}
              type="submit"
              color="secondary"
              onClick={() => {
                forgetWallet();
                onClose();
              }}
              width={'calc(50% - .5rem)'}
              disabled={deleteCheck !== 'delete'}
            >
              Delete
            </VioletButton>
          </RowContainer>
        </RowContainer>
      </DialogForm>
    </>
  );
}

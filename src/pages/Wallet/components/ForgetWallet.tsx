import React, { useState } from 'react';
import DialogForm from './DialogForm';
import { forgetWallet } from '../../../utils/wallet-seed';
import {
  Input,
  RedFilledButton,
  RowContainer,
  Title,
  WhiteButton,
} from '../../commonStyles';
import { useTheme } from '@material-ui/core';
import AttentionComponent from '../../../components/Attention';

export default function DeleteMnemonicDialog({ open, onClose, openExportMnemonicPopup }) {
  const [deleteCheck, setDeleteCheck] = useState('');
  const theme = useTheme();

  return (
    <>
      <DialogForm
        open={open}
        onClose={onClose}
        fullWidth
        height="auto"
        padding="2rem 0"
        onEnter={() => {
          setDeleteCheck('');
        }}
      >
        <RowContainer width="90%" justify="flex-start" margin="0 0 2rem 0">
          <Title fontSize="2.4rem">Forget wallet for this device</Title>
        </RowContainer>
        <RowContainer width="90%" direction="column">
          <RowContainer justify="flex-start" margin="2rem 0 0 0">
            <Title style={{ textAlign: 'left' }}>
              You will not be able to recover the current accounts without the
              seed phrase, and the account private key. This action will delete
              all current accounts from your browser.
            </Title>
          </RowContainer>
          <RowContainer margin="2rem 0 0 0">
            <AttentionComponent
              blockHeight="8rem"
              text={
                'To prevent loss of funds, please ensure you have the seed phrase and the private key for all current accounts.'
              }
            />
          </RowContainer>
          <RowContainer margin="2rem 0 0 0">
            <RedFilledButton
              theme={theme}
              background={theme.customPalette.orange.light}
              onClick={() => {
                openExportMnemonicPopup()
              }}
              width={'calc(50%)'}
            >
              Export Seed Phrase
            </RedFilledButton>
          </RowContainer>
          <RowContainer margin="2rem 0 0 0">
            <Input
              placeholder={`Please, type FORGET to confirm`}
              value={deleteCheck}
              onChange={(e) => setDeleteCheck(e.target.value)}
            />
          </RowContainer>
          <RowContainer margin="2rem 0 0 0" justify="space-between">
            <WhiteButton
              theme={theme}
              width={'calc(50% - .5rem)'}
              onClick={onClose}
            >
              Close
            </WhiteButton>
            <RedFilledButton
              theme={theme}
              onClick={() => {
                forgetWallet();
                onClose();
              }}
              width={'calc(50% - .5rem)'}
              disabled={deleteCheck !== 'FORGET'}
            >
              Forget
            </RedFilledButton>
          </RowContainer>
        </RowContainer>
      </DialogForm>
    </>
  );
}

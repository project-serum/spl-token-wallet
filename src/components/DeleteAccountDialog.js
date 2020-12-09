import React from 'react';
import DialogForm from './DialogForm';
import { forgetWallet } from '../utils/wallet-seed';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContentText } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export default function DeleteAccountDialog({
  open,
  onClose,
  isDeleteAccountEnabled,
}) {
  return (
    <>
      <DialogForm
        open={open}
        onClose={onClose}
        onSubmit={() => {
          forgetWallet();
          onClose();
        }}
        fullWidth
      >
        <DialogTitle>Excluir Conta</DialogTitle>
        <DialogContentText style={{ margin: 20 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            Voce não podera recuperar os dados da conta atual sem ter as
            palavras secretas e a chave privada atual. Essa ação pode deletar
            todas as suas contas atuais do navegador.
            <br />
            <br />
            <strong style={{ textAlign: 'center' }}>
              Para prevenir a perda de fundos, por favor confira as suas
              palavras chaves e chave privada para todas as suas contas atuais.
            </strong>
          </div>
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
          <Button
            type="submit"
            color="secondary"
            disabled={!isDeleteAccountEnabled}
          >
            Excluir Conta
          </Button>
        </DialogActions>
      </DialogForm>
    </>
  );
}

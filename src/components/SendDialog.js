import React, { useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogForm from './DialogForm';
import { useWallet } from '../utils/wallet';
import { PublicKey } from '@solana/web3.js';
import { abbreviateAddress } from '../utils/utils';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useSendTransaction } from '../utils/notifications';

export default function SendDialog({ open, onClose, publicKey, balanceInfo }) {
  const wallet = useWallet();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [transferAmountString, setTransferAmountString] = useState('');
  const [sendTransaction, sending] = useSendTransaction();

  let {
    amount: balanceAmount,
    decimals,
    mint,
    tokenName,
    tokenSymbol,
  } = balanceInfo;

  function onSubmit() {
    let amount = Math.round(
      parseFloat(transferAmountString) * Math.pow(10, decimals),
    );
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    sendTransaction(
      wallet.transferToken(
        publicKey,
        new PublicKey(destinationAddress),
        amount,
      ),
      { onSuccess: onClose },
    );
  }

  return (
    <DialogForm open={open} onClose={onClose} onSubmit={onSubmit}>
      <DialogTitle>
        Send {tokenName ?? abbreviateAddress(mint)}
        {tokenSymbol ? ` (${tokenSymbol})` : null}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Recipient Address"
          fullWidth
          variant="outlined"
          margin="normal"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value.trim())}
        />
        <TextField
          label="Amount"
          fullWidth
          variant="outlined"
          margin="normal"
          type="number"
          InputProps={{
            endAdornment: tokenSymbol ? (
              <InputAdornment position="end">{tokenSymbol}</InputAdornment>
            ) : null,
            inputProps: {
              step: Math.pow(10, -decimals),
            },
          }}
          value={transferAmountString}
          onChange={(e) => setTransferAmountString(e.target.value.trim())}
          helperText={`Max: ${balanceAmount / Math.pow(10, decimals)}`}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" color="primary" disabled={sending}>
          Send
        </Button>
      </DialogActions>
    </DialogForm>
  );
}

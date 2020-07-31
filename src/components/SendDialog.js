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

export default function SendDialog({ open, onClose, index, balanceInfo }) {
  const wallet = useWallet();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [transferAmountString, setTransferAmountString] = useState('');
  const [submitting, setSubmitting] = useState(false);

  let {
    amount: balanceAmount,
    decimals,
    mint,
    tokenName,
    tokenTicker,
  } = balanceInfo;

  async function onSubmit() {
    setSubmitting(true);
    try {
      let amount = Math.round(
        parseFloat(transferAmountString) * Math.pow(10, decimals),
      );
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }
      await wallet.transferToken(
        index,
        new PublicKey(destinationAddress),
        amount,
      );
      onClose();
    } catch (e) {
      console.warn(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogForm open={open} onClose={onClose} onSubmit={onSubmit}>
      <DialogTitle>
        Send {tokenName ?? abbreviateAddress(mint)}
        {tokenTicker ? ` (${tokenTicker})` : null}
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
            endAdornment: tokenTicker ? (
              <InputAdornment position="end">{tokenTicker}</InputAdornment>
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
        <Button type="submit" color="primary" disabled={submitting}>
          Send
        </Button>
      </DialogActions>
    </DialogForm>
  );
}

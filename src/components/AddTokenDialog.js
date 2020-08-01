import React, { useState } from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogForm from './DialogForm';
import { useAsyncResource } from 'use-async-resource/lib';
import { useWallet } from '../utils/wallet';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useUpdateTokenName } from '../utils/tokens/names';

const feeFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
});

export default function AddTokenDialog({ open, onClose }) {
  let wallet = useWallet();
  let [getCost] = useAsyncResource(wallet.tokenAccountCost, []);
  let updateTokenName = useUpdateTokenName();

  let [mintAddress, setMintAddress] = useState('');
  let [tokenName, setTokenName] = useState('');
  let [tokenSymbol, setTokenSymbol] = useState('');
  let [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setSubmitting(true);
    try {
      let mint = new PublicKey(mintAddress);
      await wallet.createTokenAccount(mint);
      updateTokenName(mint, tokenName, tokenSymbol);
      onClose();
    } catch (e) {
      console.warn(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogForm open={open} onClose={onClose} onSubmit={onSubmit}>
      <DialogTitle>Add Token</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add a token to your wallet. This will cost{' '}
          {feeFormat.format(getCost() / LAMPORTS_PER_SOL)} Solana.
        </DialogContentText>
        <TextField
          label="Token Mint Address"
          fullWidth
          variant="outlined"
          margin="normal"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
        />
        <TextField
          label="Token Name"
          fullWidth
          variant="outlined"
          margin="normal"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
        <TextField
          label="Token Symbol"
          fullWidth
          variant="outlined"
          margin="normal"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" color="primary" disabled={submitting}>
          Add
        </Button>
      </DialogActions>
    </DialogForm>
  );
}

import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogForm from './DialogForm';
import { abbreviateAddress } from '../utils/utils';
import CopyableDisplay from './CopyableDisplay';
import Link from '@material-ui/core/Link';
import { useSolanaExplorerUrlSuffix } from '../utils/connection';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export default function DepositDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  const urlSuffix = useSolanaExplorerUrlSuffix();
  let { mint, tokenName, tokenSymbol, owner } = balanceInfo;

  return (
    <DialogForm open={open} onClose={onClose}>
      <DialogTitle>
        Deposit {tokenName ?? mint.toBase58()}
        {tokenSymbol ? ` (${tokenSymbol})` : null}
      </DialogTitle>
      <DialogContent>
        {publicKey.equals(owner) ? (
          <DialogContentText>
            This address can only be used to receive SOL. Do not send other
            tokens to this address.
          </DialogContentText>
        ) : (
          <DialogContentText>
            This address can only be used to receive{' '}
            {tokenSymbol ?? abbreviateAddress(mint)}. Do not send SOL to this
            address.
          </DialogContentText>
        )}
        <CopyableDisplay
          value={publicKey.toBase58()}
          label={'Deposit Address'}
          autoFocus
          qrCode
        />
        <DialogContentText variant="body2">
          <Link
            href={
              `https://explorer.solana.com/account/${publicKey.toBase58()}` +
              urlSuffix
            }
            target="_blank"
            rel="noopener"
          >
            View on Solana Explorer
          </Link>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </DialogForm>
  );
}

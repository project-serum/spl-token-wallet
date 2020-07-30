import React, { Suspense } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { useWallet } from '../utils/wallet';
import { useAsyncResource } from 'use-async-resource';
import LoadingIndicator from './LoadingIndicator';
import { SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../utils/token-instructions';
import { parseTokenAccountData } from '../utils/token-state';

const balanceFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: true,
});

export default function BalancesList() {
  const wallet = useWallet();

  return (
    <Paper>
      <List>
        {[...Array(wallet.accountCount + 5).keys()].map((i) => (
          <Suspense key={i} fallback={<LoadingIndicator />}>
            <BalanceListItem index={i} />
          </Suspense>
        ))}
      </List>
    </Paper>
  );
}

function BalanceListItem({ index }) {
  const wallet = useWallet();
  const [getBalance] = useAsyncResource(wallet.getAccountBalance, index);

  const account = wallet.getAccount(index);
  let {
    amount,
    decimals,
    mint,
    tokenName,
    tokenTicker,
    initialized,
  } = getBalance();

  if (!initialized && index !== 0) {
    return null;
  }

  return (
    <ListItem>
      <ListItemText
        primary={
          <>
            {balanceFormat.format(amount / Math.pow(10, decimals))}{' '}
            {tokenTicker}
          </>
        }
        secondary={account.publicKey.toBase58()}
      />
    </ListItem>
  );
}

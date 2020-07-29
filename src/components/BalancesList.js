import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { useWallet } from '../utils/wallet';
import { useAsyncResource } from 'use-async-resource';

const balanceFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: true,
});

export default function BalancesList() {
  const wallet = useWallet();
  const [getSolBalance] = useAsyncResource(wallet.getSolBalance, []);
  return (
    <Paper>
      <List>
        <ListItem>
          <ListItemText
            primary={<>{balanceFormat.format(getSolBalance())} SOL</>}
            secondary={wallet.account.publicKey.toBase58()}
          />
        </ListItem>
      </List>
    </Paper>
  );
}

import React, { Suspense, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { useWallet, useWalletAccountCount } from '../utils/wallet';
import { resourceCache, useAsyncResource } from 'use-async-resource';
import LoadingIndicator from './LoadingIndicator';
import Collapse from '@material-ui/core/Collapse';
import { Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { abbreviateAddress } from '../utils/utils';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import ReceiveIcon from '@material-ui/icons/CallReceived';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { preloadResource } from 'use-async-resource/lib';
import AddTokenDialog from './AddTokenDialog';
import SendDialog from './SendDialog';

const balanceFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: true,
});

export default function BalancesList() {
  const wallet = useWallet();
  const accountCount = useWalletAccountCount();
  useEffect(() => {
    for (let i = 0; i < accountCount + 5; ++i) {
      preloadResource(wallet.getAccountBalance, i);
    }
  }, [wallet, accountCount]);
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);

  return (
    <Paper>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Balances
          </Typography>
          <Tooltip title="Add Token" arrow>
            <IconButton onClick={() => setShowAddTokenDialog(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh" arrow>
            <IconButton
              onClick={() => resourceCache(wallet.getAccountBalance).clear()}
              style={{ marginRight: -12 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <List disablePadding>
        {[...Array(accountCount + 1).keys()].map((i) => (
          <Suspense key={i} fallback={<LoadingIndicator />}>
            <BalanceListItem index={i} />
          </Suspense>
        ))}
      </List>
      <AddTokenDialog
        open={showAddTokenDialog}
        onClose={() => setShowAddTokenDialog(false)}
      />
    </Paper>
  );
}

const useStyles = makeStyles((theme) => ({
  address: {
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
  },
  itemDetails: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function BalanceListItem({ index }) {
  const wallet = useWallet();
  const [getBalance] = useAsyncResource(wallet.getAccountBalance, index);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  const account = wallet.getAccount(index);
  const balanceInfo = getBalance();
  let {
    amount,
    decimals,
    mint,
    tokenName,
    tokenTicker,
    initialized,
  } = balanceInfo;

  if (!initialized && index !== 0) {
    return null;
  }

  return (
    <>
      <ListItem button onClick={() => setOpen((open) => !open)}>
        <ListItemText
          primary={
            <>
              {balanceFormat.format(amount / Math.pow(10, decimals))}{' '}
              {tokenTicker ?? abbreviateAddress(mint)}
            </>
          }
          secondary={account.publicKey.toBase58()}
          secondaryTypographyProps={{ className: classes.address }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.itemDetails}>
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ReceiveIcon />}
            >
              Receive
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SendIcon />}
              onClick={() => setSendDialogOpen(true)}
            >
              Send
            </Button>
          </div>
          <Typography variant="body2" className={classes.address}>
            Deposit Address: {account.publicKey.toBase58()}
          </Typography>
          <Typography variant="body2">
            Token Name: {tokenName ?? 'Unknown'}
          </Typography>
          <Typography variant="body2">
            Token Symbol: {tokenTicker ?? 'Unknown'}
          </Typography>
          {mint ? (
            <Typography variant="body2" className={classes.address}>
              Token Address: {mint.toBase58()}
            </Typography>
          ) : null}
          <Typography variant="body2">
            <Link
              href={`https://explorer.solana.com/account/${account.publicKey.toBase58()}`}
              target="_blank"
              rel="noopener"
            >
              View on Solana Explorer
            </Link>
          </Typography>
        </div>
      </Collapse>
      <SendDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        balanceInfo={balanceInfo}
        index={index}
      />
    </>
  );
}

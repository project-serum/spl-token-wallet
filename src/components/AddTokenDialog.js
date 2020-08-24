import React, { useState, useEffect } from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { refreshWalletPublicKeys, useWallet } from '../utils/wallet';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useUpdateTokenName } from '../utils/tokens/names';
import { useAsyncData } from '../utils/fetch-loop';
import LoadingIndicator from './LoadingIndicator';
import { Tab, Tabs, makeStyles } from '@material-ui/core';
import { useSendTransaction } from '../utils/notifications';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { abbreviateAddress } from '../utils/utils';
import { TOKENS } from '../utils/tokens/names';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import {
  useConnectionConfig,
  useSolanaExplorerUrlSuffix,
} from '../utils/connection';
import Link from '@material-ui/core/Link';
import CopyableDisplay from './CopyableDisplay';

const feeFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
});

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.background.paper}`,
    width: '100%',
  },
}));

export default function AddTokenDialog({ open, onClose }) {
  let wallet = useWallet();
  let [tokenAccountCost] = useAsyncData(
    wallet.tokenAccountCost,
    'tokenAccountCost',
  );
  let classes = useStyles();
  let updateTokenName = useUpdateTokenName();

  let [mintAddress, setMintAddress] = useState('');
  let [tokenName, setTokenName] = useState('');
  let [tokenSymbol, setTokenSymbol] = useState('');
  let [sendTransaction, sending] = useSendTransaction();
  const { endpoint } = useConnectionConfig();
  const popularTokens = TOKENS[endpoint];
  const [tab, setTab] = useState(!!popularTokens ? 'popular' : 'manual');

  useEffect(() => {
    if (!popularTokens) {
      setTab('manual');
    }
  }, [popularTokens]);

  function onSubmit({ mintAddress, tokenName, tokenSymbol }) {
    let mint = new PublicKey(mintAddress);
    sendTransaction(wallet.createTokenAccount(mint), {
      onSuccess: () => {
        updateTokenName(mint, tokenName, tokenSymbol);
        refreshWalletPublicKeys(wallet);
        onClose();
      },
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Token</DialogTitle>
      <DialogContent>
        {tokenAccountCost ? (
          <DialogContentText>
            Add a token to your wallet. This will cost{' '}
            {feeFormat.format(tokenAccountCost / LAMPORTS_PER_SOL)} Solana.
          </DialogContentText>
        ) : (
          <LoadingIndicator />
        )}
        {!!popularTokens && (
          <Tabs
            value={tab}
            variant="standard"
            textColor="primary"
            indicatorColor="primary"
            className={classes.tabs}
            onChange={(e, value) => setTab(value)}
          >
            <Tab
              label={'Popular Tokens'}
              value="popular"
              style={{ textDecoration: 'none', width: '50%' }}
            />
            <Tab
              label={'Manual Input'}
              value="manual"
              style={{ textDecoration: 'none', width: '50%' }}
            />
          </Tabs>
        )}
        {tab === 'manual' || !popularTokens ? (
          <React.Fragment>
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
          </React.Fragment>
        ) : (
          <List disablePadding>
            {popularTokens.map((token) => (
              <TokenListItem
                key={token.mintAddress}
                {...token}
                onSubmit={onSubmit}
                disalbed={sending}
              />
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {tab === 'manual' && (
          <Button
            type="submit"
            color="primary"
            disabled={sending}
            onClick={() => onSubmit({ tokenName, tokenSymbol, mintAddress })}
          >
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function TokenListItem({
  tokenName,
  tokenSymbol,
  mintAddress,
  onSubmit,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const alreadyExists = false; // TODO
  return (
    <React.Fragment>
      <div style={{ display: 'flex' }} key={tokenName}>
        <ListItem button onClick={() => setOpen((open) => !open)}>
          <ListItemText
            primary={
              <Link
                target="_blank"
                rel="noopener"
                href={
                  `https://explorer.solana.com/account/${mintAddress}` +
                  urlSuffix
                }
              >
                {tokenName ?? abbreviateAddress(mintAddress)}
                {tokenSymbol ? ` (${tokenSymbol})` : null}
              </Link>
            }
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Button
          type="submit"
          color="primary"
          disabled={disabled || alreadyExists}
          onClick={() => onSubmit({ tokenName, tokenSymbol, mintAddress })}
        >
          {alreadyExists ? 'Added' : 'Add'}
        </Button>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CopyableDisplay
          value={mintAddress}
          label={`${tokenSymbol} Mint Address`}
        />
      </Collapse>
    </React.Fragment>
  );
}

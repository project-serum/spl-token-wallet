import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import {
  refreshWalletPublicKeys,
  useBalanceInfo,
  useWallet,
  useWalletPublicKeys,
  useWalletSelector,
} from '../utils/wallet';
import { findAssociatedTokenAddress } from '../utils/tokens';
import LoadingIndicator from './LoadingIndicator';
import Collapse from '@material-ui/core/Collapse';
import { Typography } from '@material-ui/core';
import TokenInfoDialog from './TokenInfoDialog';
import Link from '@material-ui/core/Link';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { abbreviateAddress } from '../utils/utils';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import ReceiveIcon from '@material-ui/icons/WorkOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import MergeType from '@material-ui/icons/MergeType';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { MARKETS } from '@project-serum/serum';
import AddTokenDialog from './AddTokenDialog';
import ExportAccountDialog from './ExportAccountDialog';
import SendDialog from './SendDialog';
import DepositDialog from './DepositDialog';
import {
  useIsProdNetwork,
  refreshAccountInfo,
  useSolanaExplorerUrlSuffix,
} from '../utils/connection';
import { swapApiRequest } from '../utils/swap/api';
import { showSwapAddress } from '../utils/config';
import { useAsyncData } from '../utils/fetch-loop';
import { showTokenInfoDialog } from '../utils/config';
import { useConnection, MAINNET_URL } from '../utils/connection';
import CloseTokenAccountDialog from './CloseTokenAccountButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TokenIcon from './TokenIcon';
import EditAccountNameDialog from './EditAccountNameDialog';
import MergeAccountsDialog from './MergeAccountsDialog';

const balanceFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: true,
});

const serumMarkets = (() => {
  const m = {};
  MARKETS.forEach((market) => {
    const coin = market.name.split('/')[0];
    if (m[coin]) {
      // Only override a market if it's not deprecated	.
      if (!m.deprecated) {
        m[coin] = {
          publicKey: market.address,
          name: market.name.split('/').join(''),
        };
      }
    } else {
      m[coin] = {
        publicKey: market.address,
        name: market.name.split('/').join(''),
      };
    }
  });
  return m;
})();

export default function BalancesList() {
  const wallet = useWallet();
  const [publicKeys, loaded] = useWalletPublicKeys();
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);
  const [showEditAccountNameDialog, setShowEditAccountNameDialog] = useState(
    false,
  );
  const [showMergeAccounts, setShowMergeAccounts] = useState(false);
  const { accounts, setAccountName } = useWalletSelector();
  const selectedAccount = accounts.find((a) => a.isSelected);

  return (
    <Paper>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }} component="h2">
            {selectedAccount && selectedAccount.name} Balances
          </Typography>
          {selectedAccount &&
            selectedAccount.name !== 'Main account' &&
            selectedAccount.name !== 'Hardware wallet' && (
              <Tooltip title="Edit Account Name" arrow>
                <IconButton onClick={() => setShowEditAccountNameDialog(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          <Tooltip title="Merge Accounts" arrow>
            <IconButton onClick={() => setShowMergeAccounts(true)}>
              <MergeType />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Token" arrow>
            <IconButton onClick={() => setShowAddTokenDialog(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh" arrow>
            <IconButton
              onClick={() => {
                refreshWalletPublicKeys(wallet);
                publicKeys.map((publicKey) =>
                  refreshAccountInfo(wallet.connection, publicKey, true),
                );
              }}
              style={{ marginRight: -12 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <List disablePadding>
        {publicKeys.map((publicKey) => (
          <BalanceListItem key={publicKey.toBase58()} publicKey={publicKey} />
        ))}
        {loaded ? null : <LoadingIndicator />}
      </List>
      <AddTokenDialog
        open={showAddTokenDialog}
        onClose={() => setShowAddTokenDialog(false)}
      />
      <EditAccountNameDialog
        open={showEditAccountNameDialog}
        onClose={() => setShowEditAccountNameDialog(false)}
        oldName={selectedAccount ? selectedAccount.name : ''}
        onEdit={(name) => {
          setAccountName(selectedAccount.selector, name);
          setShowEditAccountNameDialog(false);
        }}
      />
      <MergeAccountsDialog
        open={showMergeAccounts}
        onClose={() => setShowMergeAccounts(false)}
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

export function BalanceListItem({ publicKey, expandable }) {
  const wallet = useWallet();
  const balanceInfo = useBalanceInfo(publicKey);
  const classes = useStyles();
  const connection = useConnection();
  const [open, setOpen] = useState(false);
  const [isAssociatedToken, setIsAssociatedToken] = useState(false);
  // Valid states:
  //   * undefined => loading.
  //   * null => not found.
  //   * else => price is loaded.
  const [price, setPrice] = useState(undefined);
  useEffect(() => {
    if (balanceInfo && balanceInfo.tokenSymbol) {
      const coin = balanceInfo.tokenSymbol.toUpperCase();
      // Don't fetch USD stable coins. Mark to 1 USD.
      if (coin === 'USDT' || coin === 'USDC') {
        setPrice(1);
      }
      // A Serum market exists. Fetch the price.
      else if (serumMarkets[coin]) {
        let m = serumMarkets[coin];
        _priceStore.getPrice(connection, m.name).then((price) => {
          setPrice(price);
        });
      }
      // No Serum market exists.
      else {
        setPrice(null);
      }
    }
  }, [price, balanceInfo, connection]);

  expandable = expandable === undefined ? true : expandable;

  if (!balanceInfo) {
    return <LoadingIndicator delay={0} />;
  }

  let { amount, decimals, mint, tokenName, tokenSymbol } = balanceInfo;

  if (wallet && wallet.publicKey && mint) {
    findAssociatedTokenAddress(wallet.publicKey, mint).then((assocTok) => {
      if (assocTok.equals(publicKey)) {
        setIsAssociatedToken(true);
      }
    });
  }

  const subtitle = (
    <div style={{ display: 'flex', height: '20px', overflow: 'hidden' }}>
      {isAssociatedToken && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            marginRight: '5px',
          }}
        >
          <FingerprintIcon style={{ width: '20px' }} />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {publicKey.toBase58()}
      </div>
    </div>
  );

  return (
    <>
      <ListItem button onClick={() => expandable && setOpen((open) => !open)}>
        <ListItemIcon>
          <TokenIcon mint={mint} tokenName={tokenName} size={28} />
        </ListItemIcon>
        <div style={{ display: 'flex', flex: 1 }}>
          <ListItemText
            primary={
              <>
                {balanceFormat.format(amount / Math.pow(10, decimals))}{' '}
                {tokenName ?? abbreviateAddress(mint)}
                {tokenSymbol ? ` (${tokenSymbol})` : null}
              </>
            }
            secondary={subtitle}
            secondaryTypographyProps={{ className: classes.address }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {price && (
              <Typography color="textSecondary">
                ${((amount / Math.pow(10, decimals)) * price).toFixed(2)}
              </Typography>
            )}
          </div>
        </div>
        {expandable ? open ? <ExpandLess /> : <ExpandMore /> : <></>}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <BalanceListItemDetails
          publicKey={publicKey}
          serumMarkets={serumMarkets}
          balanceInfo={balanceInfo}
        />
      </Collapse>
    </>
  );
}

function BalanceListItemDetails({ publicKey, serumMarkets, balanceInfo }) {
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const classes = useStyles();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [tokenInfoDialogOpen, setTokenInfoDialogOpen] = useState(false);
  const [exportAccDialogOpen, setExportAccDialogOpen] = useState(false);
  const [
    closeTokenAccountDialogOpen,
    setCloseTokenAccountDialogOpen,
  ] = useState(false);
  const wallet = useWallet();
  const isProdNetwork = useIsProdNetwork();
  const [swapInfo] = useAsyncData(async () => {
    if (!showSwapAddress || !isProdNetwork) {
      return null;
    }
    return await swapApiRequest(
      'POST',
      'swap_to',
      {
        blockchain: 'sol',
        coin: balanceInfo.mint?.toBase58(),
        address: publicKey.toBase58(),
      },
      { ignoreUserErrors: true },
    );
  }, [
    'swapInfo',
    isProdNetwork,
    balanceInfo.mint?.toBase58(),
    publicKey.toBase58(),
  ]);

  if (!balanceInfo) {
    return <LoadingIndicator delay={0} />;
  }

  let { mint, tokenName, tokenSymbol, owner, amount } = balanceInfo;

  // Only show the export UI for the native SOL coin.
  const exportNeedsDisplay =
    mint === null && tokenName === 'SOL' && tokenSymbol === 'SOL';

  const market = tokenSymbol
    ? serumMarkets[tokenSymbol.toUpperCase()]
      ? serumMarkets[tokenSymbol.toUpperCase()].publicKey
      : undefined
    : undefined;

  return (
    <>
      {wallet.allowsExport && (
        <ExportAccountDialog
          onClose={() => setExportAccDialogOpen(false)}
          open={exportAccDialogOpen}
        />
      )}
      <div className={classes.itemDetails}>
        <div className={classes.buttonContainer}>
          {!publicKey.equals(owner) && showTokenInfoDialog ? (
            <Button
              variant="outlined"
              color="default"
              startIcon={<InfoIcon />}
              onClick={() => setTokenInfoDialogOpen(true)}
            >
              Token Info
            </Button>
          ) : null}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ReceiveIcon />}
            onClick={() => setDepositDialogOpen(true)}
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
          {mint && amount === 0 ? (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => setCloseTokenAccountDialogOpen(true)}
            >
              Delete
            </Button>
          ) : null}
        </div>
        <Typography variant="body2" className={classes.address}>
          Deposit Address: {publicKey.toBase58()}
        </Typography>
        <Typography variant="body2">
          Token Name: {tokenName ?? 'Unknown'}
        </Typography>
        <Typography variant="body2">
          Token Symbol: {tokenSymbol ?? 'Unknown'}
        </Typography>
        {mint ? (
          <Typography variant="body2" className={classes.address}>
            Token Address: {mint.toBase58()}
          </Typography>
        ) : null}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="body2">
              <Link
                href={
                  `https://explorer.solana.com/account/${publicKey.toBase58()}` +
                  urlSuffix
                }
                target="_blank"
                rel="noopener"
              >
                View on Solana
              </Link>
            </Typography>
            {market && (
              <Typography variant="body2">
                <Link
                  href={`https://dex.projectserum.com/#/market/${market}`}
                  target="_blank"
                  rel="noopener"
                >
                  View on Serum
                </Link>
              </Typography>
            )}
            {swapInfo && swapInfo.coin.erc20Contract && (
              <Typography variant="body2">
                <Link
                  href={
                    `https://etherscan.io/token/${swapInfo.coin.erc20Contract}` +
                    urlSuffix
                  }
                  target="_blank"
                  rel="noopener"
                >
                  View on Ethereum
                </Link>
              </Typography>
            )}
          </div>
          {exportNeedsDisplay && wallet.allowsExport && (
            <div>
              <Typography variant="body2">
                <Link href={'#'} onClick={(e) => setExportAccDialogOpen(true)}>
                  Export
                </Link>
              </Typography>
            </div>
          )}
        </div>
      </div>
      <SendDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        balanceInfo={balanceInfo}
        publicKey={publicKey}
      />
      <DepositDialog
        open={depositDialogOpen}
        onClose={() => setDepositDialogOpen(false)}
        balanceInfo={balanceInfo}
        publicKey={publicKey}
        swapInfo={swapInfo}
      />
      <TokenInfoDialog
        open={tokenInfoDialogOpen}
        onClose={() => setTokenInfoDialogOpen(false)}
        balanceInfo={balanceInfo}
        publicKey={publicKey}
      />
      <CloseTokenAccountDialog
        open={closeTokenAccountDialogOpen}
        onClose={() => setCloseTokenAccountDialogOpen(false)}
        balanceInfo={balanceInfo}
        publicKey={publicKey}
      />
    </>
  );
}

// Create a cached API wrapper to avoid rate limits.
class PriceStore {
  constructor() {
    this.cache = {};
  }

  async getPrice(connection, marketName) {
    return new Promise((resolve, reject) => {
      if (connection._rpcEndpoint !== MAINNET_URL) {
        resolve(undefined);
        return;
      }
      if (this.cache[marketName] === undefined) {
        fetch(`https://serum-api.bonfida.com/orderbooks/${marketName}`).then(
          (resp) => {
            resp.json().then((resp) => {
              if (resp.data.asks.length === 0 && resp.data.bids.length === 0) {
                resolve(undefined);
              } else if (resp.data.asks.length === 0) {
                resolve(resp.data.bids[0]);
              } else if (resp.data.bids.length === 0) {
                resolve(resp.data.asks[0]);
              } else {
                const mid =
                  (resp.data.asks[0].price + resp.data.bids[0].price) / 2.0;
                this.cache[marketName] = mid;
                resolve(this.cache[marketName]);
              }
            });
          },
        );
      } else {
        return resolve(this.cache[marketName]);
      }
    });
  }
}

const _priceStore = new PriceStore();

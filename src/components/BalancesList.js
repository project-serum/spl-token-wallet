import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import AddTokenDialog from './AddTokenDialog';
import ExportAccountDialog from './ExportAccountDialog';
import SendDialog from './SendDialog';
import DepositDialog from './DepositDialog';
import {
  refreshAccountInfo,
  useSolanaExplorerUrlSuffix,
} from '../utils/connection';
import { showTokenInfoDialog } from '../utils/config';
import CloseTokenAccountDialog from './CloseTokenAccountButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TokenIcon from './TokenIcon';
import EditAccountNameDialog from './EditAccountNameDialog';

const balanceFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: true,
});

export default function BalancesList() {
  const wallet = useWallet();
  const [publicKeys, loaded] = useWalletPublicKeys();
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);
  const [showEditAccountNameDialog, setShowEditAccountNameDialog] = useState(
    false,
  );
  const { accounts, setAccountName } = useWalletSelector();
  const { t } = useTranslation();
  const selectedAccount = accounts.find((a) => a.isSelected);

  return (
    <Paper>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }} component="h2">
            {t("account_balances", { account: selectedAccount && selectedAccount.name })}
          </Typography>
          {selectedAccount &&
            selectedAccount.name !== 'Main account' &&
            selectedAccount.name !== 'Hardware wallet' && (
              <Tooltip title={t("edit_account_name")} arrow>
                <IconButton onClick={() => setShowEditAccountNameDialog(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          <Tooltip title={t("add_token")} arrow>
            <IconButton onClick={() => setShowAddTokenDialog(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("refresh")} arrow>
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
  const balanceInfo = useBalanceInfo(publicKey);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  expandable = expandable === undefined ? true : expandable;

  if (!balanceInfo) {
    return <LoadingIndicator delay={0} />;
  }

  let { amount, decimals, mint, tokenName, tokenSymbol } = balanceInfo;

  return (
    <>
      <ListItem button onClick={() => expandable && setOpen((open) => !open)}>
        <ListItemIcon>
          <TokenIcon mint={mint} tokenName={tokenName} size={28} />
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              {balanceFormat.format(amount / Math.pow(10, decimals))}{' '}
              {tokenName ?? abbreviateAddress(mint)}
              {tokenSymbol ? ` (${tokenSymbol})` : null}
            </>
          }
          secondary={publicKey.toBase58()}
          secondaryTypographyProps={{ className: classes.address }}
        />
        {expandable ? open ? <ExpandLess /> : <ExpandMore /> : <></>}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <BalanceListItemDetails
          publicKey={publicKey}
          balanceInfo={balanceInfo}
        />
      </Collapse>
    </>
  );
}

function BalanceListItemDetails({ publicKey, balanceInfo }) {
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const classes = useStyles();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [tokenInfoDialogOpen, setTokenInfoDialogOpen] = useState(false);
  const [exportAccDialogOpen, setExportAccDialogOpen] = useState(false);
  const { t } = useTranslation();
  const [
    closeTokenAccountDialogOpen,
    setCloseTokenAccountDialogOpen,
  ] = useState(false);
  const wallet = useWallet();

  if (!balanceInfo) {
    return <LoadingIndicator delay={0} />;
  }

  let { mint, tokenName, tokenSymbol, owner, amount } = balanceInfo;

  // Only show the export UI for the native SOL coin.
  const exportNeedsDisplay =
    mint === null && tokenName === 'SOL' && tokenSymbol === 'SOL';

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
              {t("token_info")}
            </Button>
          ) : null}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ReceiveIcon />}
            onClick={() => setDepositDialogOpen(true)}
          >
            {t("receive")}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SendIcon />}
            onClick={() => setSendDialogOpen(true)}
          >
            {t("send")}
          </Button>
          {mint && amount === 0 ? (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => setCloseTokenAccountDialogOpen(true)}
            >
              {t("delete")}
            </Button>
          ) : null}
        </div>
        <Typography variant="body2" className={classes.address}>
          {t("deposit_address_detail", {address: publicKey.toBase58()})}
        </Typography>
        <Typography variant="body2">
          {t("token_name_detail", {tokenName: tokenName ?? 'Unknown'})}
        </Typography>
        <Typography variant="body2">
          {t("token_symbol_detail", {tokenSymbol: tokenSymbol ?? 'Unknown'})}
        </Typography>
        {mint ? (
          <Typography variant="body2" className={classes.address}>
            {t("token_address_detail", {tokenAddress: mint.toBase58()})}
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
                {t("view_solana")}
              </Link>
            </Typography>
          </div>
          {exportNeedsDisplay && wallet.allowsExport && (
            <div>
              <Typography variant="body2">
                <Link href={'#'} onClick={(e) => setExportAccDialogOpen(true)}>
                  {t("export")}
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

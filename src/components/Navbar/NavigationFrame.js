import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useWallet, useWalletSelector } from '../../utils/wallet';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AccountIcon from '@material-ui/icons/AccountCircle';
import UsbIcon from '@material-ui/icons/Usb';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import AddAccountDialog from '../AddAccountDialog';
import DeleteMnemonicDialog from '../DeleteMnemonicDialog';
import AddHardwareWalletDialog from '../AddHarwareWalletDialog';
import { ExportMnemonicDialog } from '../ExportAccountDialog.js';
import Navbar from './Navbar';
import { isExtension } from '../../utils/utils';
import { useLocation } from 'react-router-dom';
import { MobileFooter } from '../Footer/MobileFooter';

export const footerHeight = isExtension ? 0 : 6;

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 8,
    paddingRight: 8,
  },
  title: {
    flexGrow: 1,
  },
  button: {
    marginLeft: 8,
  },
  menuItemIcon: {
    minWidth: 32,
  },
}));

const StyledMain = styled.main`
  height: ${(props) =>
    props.isConnectPopup
      ? `calc(100% - ${footerHeight}rem)`
      : 'calc(100% - 12rem)'};

  @media (max-width: 850px) {
    height: calc(100%);
  }
  @media (max-width: 540px) {
    height: ${(props) =>
      props.isConnectPopup ? 'calc(100% - 3rem)' : 'calc(100% - 27rem)'};
  }
`;

export const StyledImg = styled.img`
  height: 100%;
`;

export default function NavigationFrame({ children }) {
  const isConnectPopup = window.opener;
  const wallet = useWallet();

  return isConnectPopup ? (
    <>
      <StyledMain isWalletConnected={false} isConnectPopup>
        {children}
      </StyledMain>
      <Footer />
    </>
  ) : (
    <>
      <Navbar />
      <StyledMain isWalletConnected={!!wallet}>{children}</StyledMain>
      <Footer />
      <MobileFooter />
    </>
  );
}

export function WalletSelector() {
  const { accounts, setWalletSelector, addAccount } = useWalletSelector();
  const [anchorEl, setAnchorEl] = useState(null);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [
    addHardwareWalletDialogOpen,
    setAddHardwareWalletDialogOpen,
  ] = useState(false);
  const [deleteMnemonicOpen, setDeleteMnemonicOpen] = useState(false);
  const [exportMnemonicOpen, setExportMnemonicOpen] = useState(false);
  const classes = useStyles();

  if (accounts.length === 0) {
    return null;
  }

  return (
    <>
      <AddHardwareWalletDialog
        open={addHardwareWalletDialogOpen}
        onClose={() => setAddHardwareWalletDialogOpen(false)}
        onAdd={(pubKey) => {
          addAccount({
            name: 'Hardware wallet',
            importedAccount: pubKey.toString(),
            ledger: true,
          });
          setWalletSelector({
            walletIndex: undefined,
            importedPubkey: pubKey.toString(),
            ledger: true,
          });
        }}
      />
      <AddAccountDialog
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        onAdd={({ name, importedAccount }) => {
          addAccount({ name, importedAccount });
          setWalletSelector({
            walletIndex: importedAccount ? undefined : accounts.length,
            importedPubkey: importedAccount
              ? importedAccount.publicKey.toString()
              : undefined,
            ledger: false,
          });
          setAddAccountOpen(false);
        }}
      />
      <ExportMnemonicDialog
        open={exportMnemonicOpen}
        onClose={() => setExportMnemonicOpen(false)}
      />
      <DeleteMnemonicDialog
        open={deleteMnemonicOpen}
        onClose={() => setDeleteMnemonicOpen(false)}
      />
      <Hidden xsDown>
        <Button
          color="inherit"
          onClick={(e) => setAnchorEl(e.target)}
          className={classes.button}
        >
          Account
        </Button>
      </Hidden>
      <Hidden smUp>
        <Tooltip title="Select Account" arrow>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.target)}>
            <AccountIcon />
          </IconButton>
        </Tooltip>
      </Hidden>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
      >
        {accounts.map(({ isSelected, selector, address, name, label }) => (
          <MenuItem
            key={address.toBase58()}
            onClick={() => {
              setAnchorEl(null);
              setWalletSelector(selector);
            }}
            selected={isSelected}
            component="div"
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {isSelected ? <CheckIcon fontSize="small" /> : null}
            </ListItemIcon>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography>{name}</Typography>
              <Typography color="textSecondary">
                {address.toBase58()}
              </Typography>
            </div>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => setAddHardwareWalletDialogOpen(true)}>
          <ListItemIcon className={classes.menuItemIcon}>
            <UsbIcon fontSize="small" />
          </ListItemIcon>
          Import Hardware Wallet
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setAddAccountOpen(true);
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Add Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setExportMnemonicOpen(true);
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <ImportExportIcon fontSize="small" />
          </ListItemIcon>
          Export Mnemonic
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setDeleteMnemonicOpen(true);
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Delete Mnemonic
        </MenuItem>
      </Menu>
    </>
  );
}

const useFooterStyles = makeStyles((theme) => ({
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const FooterComponent = styled.footer`
  height: 6rem;
  padding: 0 3rem 0 3rem;
  display: flex;
  justify-content: space-between;
  @media (max-width: 540px) {
    padding: 0;
    height: 0;
    display: none;
  }
`;
const FooterComponentForExtension = styled.footer`
  display: none;
  @media (max-width: 540px) {
    display: flex;
    justify-content: space-between;
    height: 3rem;
  }
`;

function Footer() {
  const classes = useFooterStyles();
  // const theme = useTheme();
  const location = useLocation();
  console.log('location', location);

  return (
    <>
      <FooterComponent className={classes.footer}>
        <span
          style={{
            fontSize: '1.3rem',
            color: '#fbf2f2',
            textTransform: 'none',
            fontFamily: 'Avenir Next medium',
          }}
        >
          {location.pathname.includes('restore')
            ? 'Restore your wallet using seed phrase to get access for SPL assets management and interaction with dApps on the Solana blockchain.'
            : location.pathname.includes('create')
            ? ' Create a cryptocurrency wallet for SPL assets management and secure connection and interaction with dApps on the Solana blockchain.'
            : 'Web-based cryptocurrency wallet or browser extension for SPL assets management and securely connect and interact with dApps on the Solana blockchain.'}
        </span>{' '}
        <Button
          variant="outlined"
          color="primary"
          component="a"
          target="_blank"
          rel="noopener"
          href="https://github.com/Cryptocurrencies-AI/spl-token-wallet"
          style={{
            border: '0',
            fontSize: '1.3rem',
            height: '50%',
            color: '#fbf2f2',
            textTransform: 'none',
          }}
        >
          Source
        </Button>
      </FooterComponent>
      <FooterComponentForExtension>
        {' '}
        <Button
          variant="outlined"
          color="primary"
          component="a"
          target="_blank"
          rel="noopener"
          href="https://t.me/CryptocurrenciesAi"
          style={{
            border: '0',
            fontSize: '1.3rem',
            height: '50%',
            color: '#fbf2f2',
            textTransform: 'none',
          }}
        >
          Need help?
        </Button>{' '}
        <Button
          variant="outlined"
          color="primary"
          component="a"
          target="_blank"
          rel="noopener"
          href="https://github.com/Cryptocurrencies-AI/spl-token-wallet"
          style={{
            border: '0',
            fontSize: '1.3rem',
            height: '50%',
            color: '#fbf2f2',
            textTransform: 'none',
          }}
        >
          Source
        </Button>
      </FooterComponentForExtension>
    </>
  );
}

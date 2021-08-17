import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { DoneAll, ExpandLess, ExpandMore } from '@material-ui/icons';
import { useConnectedWallets } from '../../utils/connected-wallets';
import { useWalletSelector } from '../../utils/wallet';
import DialogForm from '../../pages/Wallet/components/DialogForm';
import { RowContainer } from '../commonStyles';

const StyledPaper = styled(({ ...props }) => <Paper {...props} />)`
  height: auto;
  min-height: 70rem;
  padding: 2rem 4rem;
  width: 35rem;
  background: #222429;
  border: 0.1rem solid #3a475c;
  box-shadow: 0px 0px 16px rgb(125 125 131, 10%);
  border-radius: 2rem;
`;

const Text = styled.span`
  font-size: ${(props) => props.fontSize || '1.5rem'};
  padding-bottom: ${(props) => props.paddingBottom || ''};
  text-transform: none;
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  color: ${(props) => props.color || '#ecf0f3'};
`;

export default function ConnectionsList({ theme, close, open }) {
  const connectedWallets = useConnectedWallets();
  console.log('connectedWallets', connectedWallets);
  return (
    <DialogForm
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={() => close()}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer>
        <Text fontSize={'2rem'}>Connected Dapps</Text>
      </RowContainer>
      <List disablePadding>
        {Object.entries(connectedWallets).map(([origin, connectedWallet]) => (
          <ConnectionsListItem
            origin={origin}
            connectedWallet={connectedWallet}
            key={origin}
          />
        ))}
      </List>
    </DialogForm>
  );
}

const ICON_SIZE = 28;
const IMAGE_SIZE = 24;

const useStyles = makeStyles((theme) => ({
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
  listItemIcon: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
  },
  listItemImage: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
}));

function ConnectionsListItem({ origin, connectedWallet }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // TODO better way to get high res icon?
  const appleIconUrl = origin + '/apple-touch-icon.png';
  const faviconUrl = origin + '/favicon.ico';
  const [iconUrl, setIconUrl] = useState(appleIconUrl);
  const { accounts } = useWalletSelector();
  // TODO better way to do this
  const account = accounts.find(
    (account) => account.address.toBase58() === connectedWallet.publicKey,
  );

  const setAutoApprove = (autoApprove) => {
    chrome.storage.local.get('connectedWallets', (result) => {
      result.connectedWallets[origin].autoApprove = autoApprove;
      chrome.storage.local.set({ connectedWallets: result.connectedWallets });
    });
  };

  const disconnectWallet = () => {
    chrome.storage.local.get('connectedWallets', (result) => {
      delete result.connectedWallets[origin];
      chrome.storage.local.set({ connectedWallets: result.connectedWallets });
    });
  };

  return (
    <>
      <ListItem button onClick={() => setOpen((open) => !open)}>
        <ListItemIcon>
          <div className={classes.listItemIcon}>
            <img
              src={iconUrl}
              onError={() => setIconUrl(faviconUrl)}
              className={classes.listItemImage}
              alt=""
            />
          </div>
        </ListItemIcon>
        <div style={{ display: 'flex', flex: 1 }}>
          <ListItemText primary={origin} secondary={account.name} />
        </div>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.itemDetails}>
          <div className={classes.buttonContainer}>
            <Button
              variant={connectedWallet.autoApprove ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              startIcon={<DoneAll />}
              onClick={() => setAutoApprove(!connectedWallet.autoApprove)}
            >
              {connectedWallet.autoApprove ? 'Auto-Approved' : 'Auto-Approve'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={disconnectWallet}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Collapse>
    </>
  );
}

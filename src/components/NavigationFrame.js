import React, { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useConnectionConfig } from '../utils/connection';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { clusterApiUrl } from '@solana/web3.js';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  selectedNetwork: {
    fontWeight: 'bold',
  },
}));

export default function NavigationFrame({ children }) {
  const classes = useStyles();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title} component="h1">
            Solana SPL Token Wallet
          </Typography>
          <NetworkSelector />
        </Toolbar>
      </AppBar>
      <main className={classes.content}>{children}</main>
    </>
  );
}

function NetworkSelector() {
  const { endpoint, setEndpoint } = useConnectionConfig();
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const networks = [
    clusterApiUrl('mainnet-beta'),
    clusterApiUrl('devnet'),
    clusterApiUrl('testnet'),
    'http://localhost:8899',
  ];

  return (
    <>
      <Button color="inherit" onClick={(e) => setAnchorEl(e.target)}>
        Network
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {networks.map((network) => (
          <MenuItem
            key={network}
            onClick={() => {
              setEndpoint(network);
              setAnchorEl(null);
            }}
            selected={network === endpoint}
            className={network === endpoint ? classes.selectedNetwork : null}
          >
            {network}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

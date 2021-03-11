import { AppBar, Paper, Toolbar, Typography } from '@material-ui/core';
import { useConnectedWallets } from '../utils/connected-wallets';
import { useIsExtensionWidth } from '../utils/utils';

export default function ConnectionsList() {
  const isExtensionWidth = useIsExtensionWidth();
  const connectedWallets = useConnectedWallets();

  return (
    <Paper>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            style={{ flexGrow: 1, fontSize: isExtensionWidth && '1rem' }}
            component="h2"
          >
            Active Connections
          </Typography>
        </Toolbar>
      </AppBar>
      <List disablePadding>
        {connectedWallets.map((connectedWallet) => {
          <ConnectionsListItem connectedWallet={connectedWallet} />;
        })}
      </List>
    </Paper>
  );
}

function ConnectionsListItem({ connectedWallet }) {
  return null;
}

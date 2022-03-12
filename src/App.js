import React, { Suspense, useState } from 'react';
import { makeStyles, List, ListItem } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogForm from './components/DialogForm';
import NavigationFrame from './components/NavigationFrame';
import { ConnectionProvider } from './utils/connection';
import WalletPage from './pages/WalletPage';
import { useWallet, WalletProvider } from './utils/wallet';
import { ConnectedWalletsProvider } from './utils/connected-wallets';
import { TokenRegistryProvider } from './utils/tokens/names';
import LoadingIndicator from './components/LoadingIndicator';
import { SnackbarProvider } from 'notistack';
import PopupPage from './pages/PopupPage';
import OnboardingPage from './pages/OnboardingPage';
import ConnectionsPage from './pages/ConnectionsPage';
import { isExtension } from './utils/utils';
import { PageProvider, usePage } from './utils/page';

export default function App() {
  // TODO: add toggle for dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const lightTheme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          text: {
            primary: '#485068',
            secondary: '#78839C',
          },
          background: {
            default: '#EEE',
            paper: '#FFEDE8',
          },
          primary: {
            light: '#757ce8',
            main: '#FF855F',
            dark: '#D25C37',
            contrastText: '#fff',
          },
          secondary: {
            light: '#ff7961',
            main: '#FFF',
            dark: '#FFDFD7',
            contrastText: '#FF855F',
          },
        },
        typography: {
          fontFamily: ['Montserrat', 'sans-serif'],
          h1: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#0D1F3C',
          },
          h2: {
            fontSize: '32px',
            fontWeight: '600',
          },
          h3: {
            fontSize: '26px',
            fontWeight: '600',
          },
          paragraph: {
            fontSize: '15px',
            fontWeight: 'normal',
            lineHeight: '24px',
            color: '#485068',
          },
        },
        shape: {
          borderRadius: 2,
        },
        overrides: {
          MuiButton: {
            root: {
              borderRadius: 20,
            },
          },
        },
        // TODO consolidate popup dimensions
        ext: '450',
      }),
    [prefersDarkMode],
  );

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          text: {
            primary: '#FFF',
            secondary: '#FF855F',
          },
          background: {
            default: '#111',
            paper: '#333',
            tokens: '#222',
            token: '#363E48',
          },
          primary: {
            light: '#757ce8',
            main: '#FF855F',
            dark: '#D25C37',
            contrastText: '#fff',
          },
          secondary: {
            light: '#ff7961',
            main: '#FFF',
            dark: '#FFDFD7',
            contrastText: '#FF855F',
          },
        },
        typography: {
          fontFamily: ['Montserrat', 'sans-serif'],
          h1: {
            fontSize: '36px',
            fontWeight: 'bold',
          },
          h2: {
            fontSize: '32px',
            fontWeight: '600',
          },
          h3: {
            fontSize: '26px',
            fontWeight: '600',
            color: '#FFF',
          },
          h4: {
            fontWeight: 600,
            fontSize: '15px',
            color: '#FFF',
          },
          caption: {
            fontSize: '15px',
            fontWeight: '300',
            lineHeight: '24px',
          },
        },
        shape: {
          borderRadius: 2,
        },
        overrides: {
          MuiButton: {
            root: {
              borderRadius: 20,
            },
          },
          MuiDialogContentText: {
            root: {
              fontSize: '13px',
              color: '#FFEDE8',
              lineHeight: '18.5px',
              fontWeight: '400',
            },
          },
          MuiDialogTitle: {
            root: {
              '& h2': {
                fontSize: '15px',
                fontWeight: '600',
                lineHeight: '24px',
                color: '#FFF',
              },
            },
          },
          MuiTextField: {
            root: {
              '& label': {
                color: '#FFF',
              },
            },
          },
        },
        // TODO consolidate popup dimensions
        ext: '450',
      }),
    [prefersDarkMode],
  );

  // Disallow rendering inside an iframe to prevent clickjacking.
  if (window.self !== window.top) {
    return null;
  }

  let appElement = (
    <NavigationFrame>
      <Suspense fallback={<LoadingIndicator />}>
        <PageContents />
      </Suspense>
    </NavigationFrame>
  );

  if (isExtension) {
    appElement = (
      <ConnectedWalletsProvider>
        <PageProvider>{appElement}</PageProvider>
      </ConnectedWalletsProvider>
    );
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <ConnectionProvider>
          <TokenRegistryProvider>
            <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
              <WalletProvider>{appElement}</WalletProvider>
            </SnackbarProvider>
          </TokenRegistryProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </Suspense>
  );
}

function PageContents() {
  const wallet = useWallet();
  const [page] = usePage();
  const suggestionKey = 'private-irgnore-wallet-suggestion';
  const ignoreSuggestion = window.localStorage.getItem(suggestionKey);
  if (!wallet) {
    return (
      <>
        <OnboardingPage />
      </>
    );
  }
  if (window.opener) {
    return <PopupPage opener={window.opener} />;
  }
  if (page === 'wallet') {
    return <WalletPage />;
  } else if (page === 'connections') {
    return <ConnectionsPage />;
  }
}

const useStyles = makeStyles(() => ({
  walletButton: {
    width: '100%',
    padding: '16px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

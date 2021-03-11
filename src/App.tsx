import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import NavigationFrame from './components/Navbar/NavigationFrame';
import { ConnectionProvider } from './utils/connection';
import { useWallet, WalletProvider } from './utils/wallet';
import LoadingIndicator from './components/LoadingIndicator';
import { SnackbarProvider } from 'notistack';
import { hasLockedMnemonicAndSeed } from './utils/wallet-seed';

const ConnectingWallet = lazy(() => import('./routes/ConnectingWallet'));
const Wallet = lazy(() => import('./routes/WalletRouter'));
const RestorePage = lazy(() => import('./routes/RestoreWallet'));
const WelcomePage = lazy(() => import('./routes/Welcome'));
const CreateWalletPage = lazy(() => import('./routes/CreateWallet'));
const ImportWalletPage = lazy(() => import('./routes/ImportWallet'));
const WelcomeBackPage = lazy(() => import('./routes/WelcomeBack'));
const ConnectPopup = lazy(() => import('./routes/ConnectPopup'));

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    // add types later
    customPalette: any;
  }

  interface ThemeOptions {
    customPalette: any;
  }
}

export default function App() {
  // TODO: add toggle for dark mode
  const prefersDarkMode = true;
  const theme = React.useMemo(
    () =>
      createMuiTheme(
        prefersDarkMode
          ? {
              palette: {
                type: 'dark',
                primary: blue,
              },
              customPalette: {
                text: {
                  grey: '#fff',
                },
                border: {
                  main: '.1rem solid #2e2e2e',
                  new: '.1rem solid #3A475C',
                },
                grey: {
                  additional: '#fff',
                  border: '#2E2E2E',
                  light: '#96999C',
                  dark: '#93A0B2',
                  soft: '#E2E0E5',
                },
                dark: {
                  main: '#D1DDEF',
                  background: '#17181A',
                },
                blue: {
                  serum: '#7380EB',
                  new: '#366CE5',
                },
                white: {
                  main: '#fff',
                  background: '#1B2028',
                },
                red: {
                  main: '#F69894',
                },
              },
            }
          : {
              palette: {
                type: 'light',
                primary: blue,
              },
              customPalette: {
                text: {
                  grey: '#2E2E2E',
                },
                border: {
                  main: '.1rem solid #e0e5ec',
                  new: '.1rem solid #3A475C',
                },
                grey: {
                  additional: '#0E1016',
                  border: '#e0e5ec',
                  light: '#96999C',
                  dark: '#93A0B2',
                  soft: '#383B45',
                },
                dark: {
                  main: '#16253D',
                  background: '#17181A',
                },
                blue: {
                  serum: '#7380EB',
                  new: '#366CE5',
                },
                white: {
                  main: '#fff',
                  background: '#1B2028',
                },
                red: {
                  main: '#F69894',
                },
              },
            },
      ),
    [prefersDarkMode],
  );

  // Disallow rendering inside an iframe to prevent clickjacking.
  if (window.self !== window.top) {
    return null;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingIndicator />}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ConnectionProvider>
            <NavigationFrame>
              <SnackbarProvider maxSnack={5} autoHideDuration={3000}>
                <WalletProvider>
                  <Pages />
                </WalletProvider>
              </SnackbarProvider>
            </NavigationFrame>
          </ConnectionProvider>
        </ThemeProvider>
      </Suspense>
    </BrowserRouter>
  );
}

const Pages = () => {
  const wallet = useWallet()
  return (
    <Switch>
      <Route path="/connecting_wallet" component={ConnectingWallet} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/restore_wallet" component={RestorePage} />
      <Route path="/welcome" component={WelcomePage} />
      <Route path="/create_wallet" component={CreateWalletPage} />
      <Route path="/import_wallet" component={ImportWalletPage} />
      <Route path="/welcome_back" component={WelcomeBackPage} />
      <Route path="/connect_popup" component={ConnectPopup} />

      {/* popup if connecting from dex UI */}
      {window.opener && <Redirect to="/connect_popup" />}
      {/* if wallet exists - for case when we'll have unlocked wallet */}
      {!!wallet && <Redirect to="/wallet" />}
      {/* if have mnemonic in localstorage - login, otherwise - restore/import/create */}
      {hasLockedMnemonicAndSeed() ? <Redirect to="/welcome_back" /> : <Redirect to="/welcome" />}
  </Switch>
  )
}
import React, { Suspense, lazy, useMemo } from 'react';
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
import SnackbarProvider from './components/SnackbarProvider';
import { hasLockedMnemonicAndSeed } from './utils/wallet-seed';
import { TokenRegistryProvider } from './utils/tokens/names';

const ConnectPopup = lazy(() => import('./routes/ConnectPopup'));
const WelcomeBackPage = lazy(() => import('./routes/WelcomeBack'));
const Wallet = lazy(() => import('./routes/WalletRouter'));

// const ConnectingWallet = lazy(() => import('./routes/ConnectingWallet'));
// const Wallet = lazy(() => import('./routes/WalletRouter'));
const RestorePage = lazy(() => import('./routes/RestoreWallet'));
const WelcomePage = lazy(() => import('./routes/Welcome'));
const CreateWalletPage = lazy(() => import('./routes/CreateWallet'));
// const ImportWalletPage = lazy(() => import('./routes/ImportWallet'));
// const WelcomeBackPage = lazy(() => import('./routes/WelcomeBack'));

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
                  background: '#222429',
                },
                dark: {
                  main: '#D1DDEF',
                  background: '#17181A',
                },
                blue: {
                  serum: '#366CE5',
                  new: '#366CE5',
                },
                white: {
                  main: '#fff',
                  background: '#1B2028',
                },
                red: {
                  main: '#F69894',
                },
                green: {
                  main: '#97E873',
                  light: '#A5E898',
                },
                orange: {
                  dark: '#F8B567',
                  light: '#F29C38',
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
                  background: '#222429',
                },
                dark: {
                  main: '#16253D',
                  background: '#17181A',
                },
                blue: {
                  serum: '#366CE5',
                  new: '#366CE5',
                },
                white: {
                  main: '#fff',
                  background: '#1B2028',
                },
                red: {
                  main: '#F69894',
                },
                green: {
                  main: '#97E873',
                  light: '#A5E898',
                },
                orange: {
                  dark: '#F8B567',
                  light: '#F29C38',
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
            <TokenRegistryProvider>
              <SnackbarProvider maxSnack={5} autoHideDuration={3000}>
                <WalletProvider>
                  <NavigationFrame>
                    <Pages />
                  </NavigationFrame>
                </WalletProvider>
              </SnackbarProvider>
            </TokenRegistryProvider>
          </ConnectionProvider>
        </ThemeProvider>
      </Suspense>
    </BrowserRouter>
  );
}

const Pages = () => {
  const wallet = useWallet();
  
  useMemo(() => {
    let params = new URLSearchParams(window.location.hash.slice(1));
    const origin = params.get('origin')

    if (origin) {
      localStorage.setItem('origin', origin)
    } else {
      localStorage.removeItem('origin')
    }
  }, []);

  return (
    <Switch>
      {/* <Route path="/connecting_wallet" component={ConnectingWallet} /> */}
      <Route path="/wallet" component={Wallet} />
      <Route 
        path="/restore_wallet" 
        component={RestorePage}
      />
      <Route path="/welcome" component={WelcomePage} />
      <Route path="/create_wallet" 
        component={CreateWalletPage}
      />
      {/* <Route path="/import_wallet" component={ImportWalletPage} /> */}
      <Route exact path="/welcome_back" component={WelcomeBackPage} />
      <Route
        path="/connect_popup"
        component={ConnectPopup}
      />

      {/* popup if connecting from dex UI */}
      {window.opener && !!wallet && <Redirect from="/" to="/connect_popup" />}

      {/* if wallet exists - for case when we'll have unlocked wallet */}
      {!!wallet && <Redirect from="/" to="/wallet" />}

      {/* if have mnemonic in localstorage - login, otherwise - restore/import/create */}
      {hasLockedMnemonicAndSeed() ? (
        <Redirect from="/" to="/welcome_back" />
      ) : (
        <Redirect from="/" to="/welcome" />
      )}
    </Switch>
  );
};

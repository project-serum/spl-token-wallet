import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import NavigationFrame from './components/Navbar/NavigationFrame';
import { ConnectionProvider } from './utils/connection';
import { WalletProvider } from './utils/wallet';
import LoadingIndicator from './components/LoadingIndicator';
import { SnackbarProvider } from 'notistack';

const Login = lazy(() => import('./routes/LoginRouter'));
const ConnectingWallet = lazy(() => import('./routes/ConnectingWalletRouter'));
const Wallet = lazy(() => import('./routes/WalletRouter'));
const RestorePage = lazy(() => import('./routes/Onboarding'));
const WelcomePage = lazy(() => import('./routes/WelcomeRouter'));
const CreateWalletPage = lazy(() => import('./routes/CreateWalletRouter'));

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
                },
                dark: {
                  main: '#D1DDEF',
                  background: '#17181A',
                },
                blue: {
                  serum: '#7380EB',
                },
                white: {
                  main: '#fff',
                  background: '#1B2028',
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
                },
                dark: {
                  main: '#16253D',
                  background: '#17181A',
                },
                blue: {
                  serum: '#7380EB',
                },
                white: {
                  main: '#fff',
                  background: '#1B2028',
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
              <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
                <WalletProvider>
                  <Switch>
                    <Redirect from="/" to="/login" exact />
                    <Route path="/login" component={Login} />
                    <Route
                      path="/connecting_wallet"
                      component={ConnectingWallet}
                    />
                    <Route path="/wallet" component={Wallet} />
                    <Route path="/restore_wallet" component={RestorePage} />
                    <Route path="/welcome" component={WelcomePage} />
                    <Route path="/create_wallet" component={CreateWalletPage} />
                  </Switch>
                </WalletProvider>
              </SnackbarProvider>
            </NavigationFrame>
          </ConnectionProvider>
        </ThemeProvider>
      </Suspense>
    </BrowserRouter>
  );
}

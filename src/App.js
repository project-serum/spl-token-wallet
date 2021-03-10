import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import NavigationFrame from './components/NavigationFrame';
import { ConnectionProvider } from './utils/connection';
import WalletPage from './pages/WalletPage';
import { useWallet, WalletProvider } from './utils/wallet';
import LoadingIndicator from './components/LoadingIndicator';
import { SnackbarProvider } from 'notistack';
import PopupPage from './pages/PopupPage';
import LoginPage from './pages/LoginPage';

const Login = lazy(() => import('./routes/LoginRouter'));
const ConnectingWallet = lazy(() => import('./routes/ConnectingWalletRouter'));
const Wallet = lazy(() => import('./routes/WalletRouter'));
const RestorePage = lazy(() => import('./routes/RestoreWallet'));
const WelcomePage = lazy(() => import('./routes/WelcomeRouter'));
const CreateWalletPage = lazy(() => import('./routes/CreateWalletRouter'));
const ImportWalletPage = lazy(() => import('./routes/ImportWallet'));

export default function App() {
  // TODO: add toggle for dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: blue,
        },
      }),
    [prefersDarkMode],
  );

  // Disallow rendering inside an iframe to prevent clickjacking.
  if (window.self !== window.top) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <ConnectionProvider>
          <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
            <WalletProvider>
              <NavigationFrame>
                <Suspense fallback={<LoadingIndicator />}>
                  <PageContents />
                </Suspense>
              </NavigationFrame>
            </WalletProvider>
          </SnackbarProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </Suspense>
  );
}

function PageContents() {
  const wallet = useWallet();
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/connecting_wallet" component={ConnectingWallet} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/restore_wallet" component={RestorePage} />
        <Route path="/welcome" component={WelcomePage} />
        <Route path="/create_wallet" component={CreateWalletPage} />
        <Route path="/import_wallet" component={ImportWalletPage} />
      </Switch>
    </BrowserRouter>
  );

  // if (!wallet) {
  //   return <LoginPage />;
  // }
  // if (window.opener) {
  //   return <PopupPage opener={window.opener} />;
  // }
  // return <WalletPage />;
}

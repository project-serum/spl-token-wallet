import React, { Suspense } from 'react';
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
          <WalletProvider>
            <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
              <NavigationFrame>
                <Suspense fallback={<LoadingIndicator />}>
                  <PageContents />
                </Suspense>
              </NavigationFrame>
            </SnackbarProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </Suspense>
  );
}

function PageContents() {
  const wallet = useWallet();
  if (!wallet) {
    return <LoginPage />;
  }
  if (window.opener) {
    return <PopupPage opener={window.opener} />;
  }
  return <WalletPage />;
}

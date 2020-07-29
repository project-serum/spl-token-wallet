import React, { Suspense } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import NavigationFrame from './components/NavigationFrame';
import { ConnectionProvider } from './utils/connection';
import WalletPage from './WalletPage';
import { WalletProvider } from './utils/wallet';
import LoadingIndicator from './components/LoadingIndicator';

function App() {
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
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConnectionProvider>
          <WalletProvider>
            <NavigationFrame>
              <Suspense fallback={<LoadingIndicator />}>
                <WalletPage />
              </Suspense>
            </NavigationFrame>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;

import React, { Suspense, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  // ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import NavigationFrame from './components/NavigationFrame';
import { ConnectionProvider } from './utils/connection';
import WalletPage from './pages/WalletPage';
import { useWallet, WalletProvider } from './utils/wallet';
import LoadingIndicator from './components/LoadingIndicator';
import BasicLayout from './components/layout/BasicLayout';
import { SnackbarProvider } from 'notistack';
import PopupPage from './pages/PopupPage';
import LoginPage from './pages/LoginPage';
import { GlobalStyle } from './modules/styles/global';
import pageRouter from './routes/pageRouter';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './modules/styles/theme';
import { supportLightMode } from './config/whiteList';

const themeConfig = sessionStorage.getItem('theme');
export const ThemeContext = React.createContext({});
export default function App() {
  console.log(window.location.pathname);
  const isSupportLightMode = supportLightMode.includes(
    window.location.pathname,
  );
  console.log(isSupportLightMode);
  const [mode, setTheme] = useState(themeConfig || 'light');
  const toggleTheme = () => {
    setTheme(mode === 'light' ? 'dark' : 'light');
  };
  // TODO: add toggle for dark mode
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const theme = React.useMemo(
  //   () =>
  //     createMuiTheme({
  //       palette: {
  //         type: prefersDarkMode ? 'dark' : 'light',
  //         primary: blue,
  //       },
  //     }),
  //   [prefersDarkMode],
  // );

  // Disallow rendering inside an iframe to prevent clickjacking.
  if (window.self !== window.top) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ThemeProvider
        theme={{ ...theme, mode: isSupportLightMode ? mode : 'dark' }}
      >
        <ThemeContext.Provider
          value={{ mode: isSupportLightMode ? mode : 'dark', toggleTheme }}
        >
          <CssBaseline />
          <ConnectionProvider>
            <WalletProvider>
              <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
                {/* <NavigationFrame> */}
                <GlobalStyle />
                <Suspense fallback={<LoadingIndicator />}>
                  <PageContents />
                </Suspense>
                {/* </NavigationFrame> */}
              </SnackbarProvider>
            </WalletProvider>
          </ConnectionProvider>
        </ThemeContext.Provider>
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
  return (
    <BrowserRouter>
      <BasicLayout>{pageRouter()}</BasicLayout>
    </BrowserRouter>
  );
  // return <WalletPage />;
}

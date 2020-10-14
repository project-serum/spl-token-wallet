import React, { Suspense } from 'react';
import './App.less';
import { GlobalStyle } from './global-style';
import NavigationFrame from './components/NavigationFrame';
import { ConnectionProvider } from './utils/connection';
import WalletPage from './pages/WalletPage';
import { useWallet, WalletProvider } from './utils/wallet';
import LoadingIndicator from './components/LoadingIndicator';
import PopupPage from './pages/PopupPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  // Disallow rendering inside an iframe to prevent clickjacking.
  if (window.self !== window.top) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <GlobalStyle />
      <ConnectionProvider>
        <WalletProvider>
          <NavigationFrame>
            <Suspense fallback={<LoadingIndicator />}>
              <PageContents />
            </Suspense>
          </NavigationFrame>
        </WalletProvider>
      </ConnectionProvider>
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

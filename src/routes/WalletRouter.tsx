import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Wallet from '../pages/Wallet';
import { useWallet } from '../utils/wallet';
import { useHasLockedMnemonicAndSeed } from '../utils/wallet-seed';

export default function LoginRoutes({ match, location }) {
  const wallet = useWallet();
  const [hasLockedMnemonicAndSeed] = useHasLockedMnemonicAndSeed();

  return (
    <Switch>
      {!wallet ? (
        hasLockedMnemonicAndSeed ? (
          <Redirect to="/welcome_back" />
        ) : (
          <Redirect to="/welcome" />
        )
      ) : null}
      <Route path={match.url} component={Wallet} />
    </Switch>
  );
}

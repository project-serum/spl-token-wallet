import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useWallet } from '../utils/wallet';
import {
  hasLockedMnemonicAndSeed,
} from '../utils/wallet-seed';

export default () => {
  const wallet = useWallet()

  return (
    <Switch>
      {!!wallet && <Redirect to="/wallet" />}
      {hasLockedMnemonicAndSeed() ? <Redirect to="/welcome_back" /> : <Redirect to="/welcome" />}
    </Switch>
  );
}

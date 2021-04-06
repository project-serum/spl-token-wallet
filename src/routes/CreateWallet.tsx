import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { CreateWalletPage } from '../pages/CreateWallet/index';

export default function CreateWalletRoute({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={CreateWalletPage} />
    </Switch>
  );
}

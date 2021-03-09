import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import WalletPage from '../pages/WalletPage';

export default function LoginRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={WalletPage} />
    </Switch>
  );
}

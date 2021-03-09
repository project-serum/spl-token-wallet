import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RestorePage } from '../pages/RestoreWallet/index';

export default function WelcomeRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={RestorePage} />
    </Switch>
  );
}

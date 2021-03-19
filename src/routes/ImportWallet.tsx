import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ImportPage } from '../pages/ImportWallet/index';

export default function LoginRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={ImportPage} />
    </Switch>
  );
}

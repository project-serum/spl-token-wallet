import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

export default function LoginRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={LoginPage} />
    </Switch>
  );
}

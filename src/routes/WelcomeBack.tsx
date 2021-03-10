import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomeBackPage from '../pages/WelcomeBack';

export default function LoginRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={WelcomeBackPage} />
    </Switch>
  );
}

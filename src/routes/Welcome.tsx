import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { WelcomePage } from '../pages/WelcomePage/index';

export default function LoginRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={WelcomePage} />
    </Switch>
  );
}

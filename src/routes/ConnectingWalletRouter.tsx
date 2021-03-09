import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import PopupPage from '../pages/PopupPage';

export default function LoginRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={PopupPage} />
    </Switch>
  );
}

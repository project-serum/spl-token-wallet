import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ConnectPopup from '../pages/ConnectPopup/PopupPage';

export default function ConnectPopupRoute({ match, origin }) {
  return (
    <Switch>
      <Route
        path={match.url}
        component={ConnectPopup}
      />
    </Switch>
  );
}

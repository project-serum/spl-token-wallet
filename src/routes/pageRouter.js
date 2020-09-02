import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Index from '../pages/index';
import ConnectWallet from '../pages/connectWallet';
import CreateAccount from '../pages/createAccount';
import NewSollet from '../pages/newSollet';
import Restore from '../pages/restore';
import SetPassword from '../pages/setPassword';

const getRouter = () => (
    <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/connectWallet" component={ConnectWallet}/>
        <Route path="/createAccount" component={CreateAccount}/>
        <Route path="/newSollet" component={NewSollet}/>
        <Route path="/restore" component={Restore}/>
        <Route path="/setPassword" component={SetPassword}/>
    </Switch>
);

export default getRouter;
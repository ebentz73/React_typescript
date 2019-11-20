// @flow
import React from 'react';
import {Route, Switch} from 'fusion-plugin-react-router';
import {Home} from './pages/home';
import PageNotFound from './pages/pageNotFound';
import {LightTheme, BaseProvider} from 'baseui';
import {Login} from './pages/login';

const root = (
  <BaseProvider theme={LightTheme}>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route component={PageNotFound} />
    </Switch>
  </BaseProvider>
);

export default root;

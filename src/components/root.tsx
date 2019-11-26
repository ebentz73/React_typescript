// @flow
import React from 'react';
import {Route, Switch} from 'fusion-plugin-react-router';
import {Home} from './pages/home';
import PageNotFound from './pages/pageNotFound';
import {BaseProvider, styled, createTheme, lightThemePrimitives} from 'baseui';
import {Login} from './pages/login';
import {Logout} from './pages/logout';

const RootStyles = styled('div', ({$theme: {typography: {font300}}}) => ({
  ...font300,
  maxWidth: '1280px',
  margin: '0 auto',
}));

const theme = createTheme({
  ...lightThemePrimitives,
  primary: '#CCAF74',
});

const root = (
  <BaseProvider theme={theme}>
    <RootStyles>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route component={PageNotFound} />
      </Switch>
    </RootStyles>
  </BaseProvider>
);

export default root;

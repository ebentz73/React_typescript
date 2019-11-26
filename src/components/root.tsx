// @flow
import React from 'react';
import {Route, Switch} from 'fusion-plugin-react-router';
import {Home} from './pages/home';
import {BaseProvider, styled, createTheme, lightThemePrimitives} from 'baseui';
import {Login} from './pages/login';
import {Logout} from './pages/logout';
import {Helmet} from 'fusion-plugin-react-helmet-async';

const RootStyles = styled('div', ({$theme: {typography: {font300}}}) => ({
  ...font300,
  height: '100%',
}));

const theme = createTheme({
  ...lightThemePrimitives,
  primary: '#CCAF74',
});

// Need BaseWeb to provide more accurate typings to include overrides
const TsIgnoreBaseProvider: any = BaseProvider;

const root = (
  <TsIgnoreBaseProvider
    theme={theme}
    overrides={{AppContainer: {style: {height: '100%'}}}}
  >
    <RootStyles>
      <Helmet>
        <style>{`
html,body,#root,#wrapper{height:100%;}
html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);}
body{margin:0;}
button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}
input::-webkit-inner-spin-button,input::-webkit-outer-spin-button,input::-webkit-search-cancel-button,input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none;}
      `}</style>
        <title>A Frosted Affair</title>
      </Helmet>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route path="/" component={Home} />
      </Switch>
    </RootStyles>
  </TsIgnoreBaseProvider>
);

export default root;

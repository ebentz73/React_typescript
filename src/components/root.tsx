// @flow
import React from 'react';
import {Route, Switch} from 'fusion-plugin-react-router';
import {Home} from './pages/home';
import {BaseProvider, styled, createTheme, lightThemePrimitives} from 'baseui';
import {Login} from './pages/login';
import {Logout} from './pages/logout';
import {Helmet} from 'fusion-plugin-react-helmet-async';
import {RoutePaths} from '../constants';

const RootStyles = styled('div', ({$theme: {typography: {font300}}}) => ({
  ...font300,
  height: '100%',
}));

const primitives = {
  ...lightThemePrimitives,
  primary: '#CCAF74',
  primary100: '#F1EAD9',
  primary200: '#F7F3EB',
  primary300: '#F0E8D7',
  primary400: '#E9DCC3',
  primary500: '#E1D1AF',
  primary600: '#DAC59B',
  primary700: '#D3BA87',
  primaryFontFamily: 'Lato',
};

const theme = createTheme(primitives, {
  colors: {
    tableHeadBackgroundColor: '#F3F2F2',
    tableBackground: '#FFFFFF',
    tableStripedBackground: '#F6F6F6',
    tableFilter: '#AFAFAF',
    tableFilterHeading: '#757575',
    tableFilterBackground: '#FFFFFF',
    tableFilterFooterBackground: '#F6F6F6',
    buttonSecondaryFill: '#FFFFFF',
    buttonSecondaryText: primitives.primary,
    buttonSecondaryHover: primitives.primary300,
    buttonSecondaryActive: primitives.primary500,
  },
  titleFont: {
    fontSize: '28px',
    lineHeight: '28px',
    fontFamily: 'Merriweather',
    fontWeight: 'normal',
  },
  eventDateFont: {
    color: '#1E1E1C',
    fontSize: '14px',
    letterSpacing: '0.51px',
    lineHeight: '26px',
  },
  eventTitleFont: {
    color: '#0B0C0E',
    fontSize: '16px',
    lineHeight: '24px',
  },
  eventTotalBudgetFont: {
    color: '0B0C0E',
    fontSize: '13px',
    letterSpacing: '0.47px',
    lineHeight: '32px',
  },
  fonts: {
    tableHeader: {
      fontSize: '12px',
      letterSpacing: '0.44px',
      lineHeight: '24px',
    },
    tableContents: {
      fontSize: '14px',
      lineHeight: '17px',
    },
  },
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
        <Route exact path={RoutePaths.Login()} component={Login} />
        <Route exact path={RoutePaths.Logout()} component={Logout} />
        <Route path={RoutePaths.Events()} component={Home} />
      </Switch>
    </RootStyles>
  </TsIgnoreBaseProvider>
);

export default root;

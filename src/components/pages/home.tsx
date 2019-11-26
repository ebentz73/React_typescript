import React from 'react';
import {useStyletron} from 'baseui';
import {useQuery} from '@apollo/react-hooks';
import {Redirect, Switch, Route} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';
import PageNotFound from './pageNotFound';
import {EventsPage} from './events';
import {assetUrl} from 'fusion-core';
import {EventPage} from './event';

const Header = ({eventSelected}: {eventSelected: boolean}) => {
  const [css, theme] = useStyletron();
  const containerStyles = css({
    height: '80px',
    display: 'flex',
    backgroundColor: eventSelected ? '#FFFFFF' : '#F3F2F2',
    alignItems: 'center',
    borderBottom: '1px solid #F3F2F2',
  });
  const logoStyles = css({
    marginLeft: theme.sizing.scale1000,
  });

  return (
    <div className={containerStyles}>
      <div className={logoStyles}>
        <img src={assetUrl('../../static/logo.svg')} />
      </div>
    </div>
  );
};

export const Home = () => {
  const [css] = useStyletron();

  const containerStyles = css({
    height: '100%',
    display: 'flex',
    backgroundColor: '#F3F2F2',
    flexDirection: 'column',
  });

  const {
    data: {session},
  } = useQuery<SessionQueryType>(SessionQuery);

  if (!session.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={containerStyles}>
      <Switch>
        <Route
          path="/event/:eventId/"
          render={() => <Header eventSelected={true} />}
        />
        <Route render={() => <Header eventSelected={false} />} />
      </Switch>
      <div className={css({flexGrow: 1})}>
        <Switch>
          <Route exact path="/" component={EventsPage} />
          <Route path="/event/:eventId/" component={EventPage} />
          <Route component={PageNotFound} />;
        </Switch>
      </div>
    </div>
  );
};

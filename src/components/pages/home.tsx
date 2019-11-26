import React from 'react';
import {useStyletron} from 'baseui';
import {useQuery} from '@apollo/react-hooks';
import {Redirect, Switch, Route, Link} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';
import PageNotFound from './pageNotFound';
import {EventsPage} from './events';
import {assetUrl} from 'fusion-core';
import {EventPage} from './event';
import {NewEventPage} from './new-event';

const Header = ({eventSelected}: {eventSelected: boolean}) => {
  const [css, theme] = useStyletron();
  const containerStyles = css({
    flex: '0 0 80px',
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
        <Link to="/">
          <img src={assetUrl('../../static/logo.svg')} />
        </Link>
      </div>
    </div>
  );
};

export const Home = () => {
  const [css] = useStyletron();

  const containerStyles = css({
    display: 'flex',
    backgroundColor: '#F3F2F2',
    flexDirection: 'column',
  });

  const fullHeightContainerStyles = css({
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

  const pageContent = (
    <>
      <Switch>
        <Route
          path="/event/:eventId/"
          render={() => <Header eventSelected={true} />}
        />
        <Route render={() => <Header eventSelected={false} />} />
      </Switch>
      <Switch>
        <Route exact path="/" component={EventsPage} />
        <Route exact path="/new-event" component={NewEventPage} />
        <Route path="/event/:eventId/" component={EventPage} />
        <Route component={PageNotFound} />;
      </Switch>
    </>
  );

  return (
    <Switch>
      <Route
        exact
        path="/new-event"
        render={() => <div className={containerStyles}>{pageContent}</div>}
      />
      <Route
        render={() => (
          <div className={fullHeightContainerStyles}>{pageContent}</div>
        )}
      />
    </Switch>
  );
};

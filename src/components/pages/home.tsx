import React, {useContext} from 'react';
import {useStyletron} from 'baseui';
import {useQuery} from '@apollo/react-hooks';
import {Redirect, Switch, Route, Link} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';
import PageNotFound from './pageNotFound';
import {EventsPage} from './events';
import {assetUrl} from 'fusion-core';
import {EventPage} from './event';
import {NewEventPage} from './new-event';
import {RoutePaths} from '../../constants';
import {MaybeEventContextProvider, MaybeEventContext} from '../event/context';

const Header = () => {
  const [css, theme] = useStyletron();
  const {event} = useContext(MaybeEventContext);

  const containerStyles = css({
    flex: '0 0 80px',
    display: 'flex',
    backgroundColor: event ? '#FFFFFF' : '#F3F2F2',
    alignItems: 'center',
    borderBottom: '1px solid #F3F2F2',
  });
  const logoStyles = css({
    marginLeft: theme.sizing.scale1000,
  });
  const eventNameStyles = css({
    marginLeft: theme.sizing.scale1000,
  });

  return (
    <div className={containerStyles}>
      <div className={logoStyles}>
        <Link to="/">
          <img src={assetUrl('../../static/logo.svg')} />
        </Link>
      </div>
      {event && <div className={eventNameStyles}>{event.name}</div>}
    </div>
  );
};

export const Home = () => {
  const [css] = useStyletron();

  const containerStyles = css({
    minHeight: '100%',
    display: 'flex',
    backgroundColor: '#F3F2F2',
    flexDirection: 'column',
  });

  const fullHeightContainerStyles = css({
    height: '100%',
    display: 'flex',
    backgroundColor: '#F3F2F2',
    flexDirection: 'column',
    overflowY: 'scroll',
  });

  const {
    data: {session},
  } = useQuery<SessionQueryType>(SessionQuery);

  if (!session.isLoggedIn) {
    return <Redirect to={RoutePaths.Login()} />;
  }

  const pageContent = (
    <>
      <Switch>
        <Route
          path={RoutePaths.Event()}
          render={props => (
            <MaybeEventContextProvider eventId={props.match.params.eventId}>
              <Header />
            </MaybeEventContextProvider>
          )}
        />
        <Route
          render={() => (
            <MaybeEventContextProvider eventId={null}>
              <Header />
            </MaybeEventContextProvider>
          )}
        />
      </Switch>
      <Switch>
        <Route exact path={RoutePaths.Events()} component={EventsPage} />
        <Route exact path={RoutePaths.NewEvent()} component={NewEventPage} />
        <Route path={RoutePaths.Event()} component={EventPage} />
        <Route component={PageNotFound} />;
      </Switch>
    </>
  );

  return (
    <Switch>
      <Route
        exact
        path={RoutePaths.NewEvent()}
        render={() => <div className={containerStyles}>{pageContent}</div>}
      />
      <Route
        exact
        path={RoutePaths.Event()}
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

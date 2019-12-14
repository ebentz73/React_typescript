import React from 'react';
import {useStyletron} from 'baseui';
import {useQuery} from '@apollo/react-hooks';
import {Redirect, Switch, Route} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';
import PageNotFound from './pageNotFound';
import {EventsPage} from './events';
import {EventPage} from './event';
import {NewEventPage} from './new-event';
import {RoutePaths} from '../../constants';
import {MaybeEventContextProvider} from '../event/context';
import {Header} from '../header';
import {EventsContextProvider} from '../events/context';

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

  const {data} = useQuery<SessionQueryType>(SessionQuery);

  if (!data) {
    return null;
  }

  if (!data.session.isLoggedIn) {
    return <Redirect to={RoutePaths.Login()} />;
  }

  const pageContent = (
    <>
      <Switch>
        <Route
          exact
          path={RoutePaths.NewVendor()}
          render={() => (
            <MaybeEventContextProvider eventId={null}>
              <Header />
            </MaybeEventContextProvider>
          )}
        />
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
      <EventsContextProvider>
        <Switch>
          <Route exact path={RoutePaths.Events()} component={EventsPage} />
          <Route exact path={RoutePaths.NewEvent()} component={NewEventPage} />
          <Route path={RoutePaths.Event()} component={EventPage} />
          <Route component={PageNotFound} />;
        </Switch>
      </EventsContextProvider>
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

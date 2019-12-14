import React from 'react';
import {useStyletron} from 'baseui';
import {useQuery} from '@apollo/react-hooks';
import {Redirect, Switch, Route} from 'fusion-plugin-react-router';
import {useRouteMatch} from 'react-router';
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
  const newVendorPageMatch = useRouteMatch(RoutePaths.NewVendor());
  const editVendorPageMatch = useRouteMatch(RoutePaths.EditVendor());
  const eventPageMatch = useRouteMatch<{eventId: string}>(RoutePaths.Event());
  const newEventPageMatch = useRouteMatch(RoutePaths.NewEvent());

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
      {newVendorPageMatch || editVendorPageMatch || !eventPageMatch ? (
        <MaybeEventContextProvider eventId={null}>
          <Header />
        </MaybeEventContextProvider>
      ) : (
        <MaybeEventContextProvider eventId={eventPageMatch.params.eventId}>
          <Header />
        </MaybeEventContextProvider>
      )}
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

  return newEventPageMatch || (eventPageMatch && eventPageMatch.isExact) ? (
    <div className={containerStyles}>{pageContent}</div>
  ) : (
    <div className={fullHeightContainerStyles}>{pageContent}</div>
  );
};

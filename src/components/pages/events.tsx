import React, {useContext} from 'react';
import {useStyletron} from 'baseui';
import {EventFilters} from '../events/filters';
import {EventsGrid} from '../events/grid';
import {Spinner} from 'baseui/spinner';
import {RoutePaths} from '../../constants';
import {EventsContextProvider, EventsContext} from '../events/context';

export const EventsPage = ({history}) => (
  <EventsContextProvider>
    <EventsPageInternal history={history} />
  </EventsContextProvider>
);

const EventsPageInternal = ({history}) => {
  const [css, theme] = useStyletron();
  const {
    state: {events, filterType, searchQuery},
    actions: {setFilterType, setSearchQuery},
  } = useContext(EventsContext);

  return (
    <div
      className={css({
        padding: `0 ${theme.sizing.scale1600}`,
      })}
    >
      <div className={css({...theme.typography.font750, marginBottom: '32px'})}>
        Events
      </div>
      <EventFilters
        selectedFilterType={filterType}
        setSelectedFilterType={setFilterType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        goToNewEvent={() => history.push(RoutePaths.NewEvent())}
      ></EventFilters>
      {events.isLoading ? (
        <div className={css({marginTop: '100px', textAlign: 'center'})}>
          <Spinner
            size="140px"
            overrides={{
              ActivePath: {
                style: {fill: theme.colors.primary},
              },
            }}
          />
        </div>
      ) : (
        <EventsGrid events={events.events} />
      )}
    </div>
  );
};

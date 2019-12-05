import React, {useContext} from 'react';
import {EventFilters} from '../events/filters';
import {EventsGrid} from '../events/grid';
import {Spinner} from 'baseui/spinner';
import {RoutePaths} from '../../constants';
import {EventsContext} from '../events/context';
import {useFrostedStyletron} from '../util';

export const EventsPage = ({history}) => {
  const [css, theme] = useFrostedStyletron();
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
      <div className={css({...theme.titleFont, marginBottom: '32px'})}>
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

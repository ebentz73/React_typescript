import React, {useState} from 'react';
import {useStyletron} from 'baseui';
import {EventsQueryType, EventsQuery} from '../queries';
import {useQuery} from '@apollo/react-hooks';
import {EventFilters} from '../events/filters';
import {EventsGrid} from '../events/grid';
import {EventFilterType} from '../../data/schema-types';
import {Spinner} from 'baseui/icon';
import {RoutePaths} from '../../constants';

export const EventsPage = ({history}) => {
  const [css, theme] = useStyletron();
  const [filterType, setFilterType] = useState<EventFilterType>(
    EventFilterType.ALL
  );
  const {data, loading} = useQuery<EventsQueryType>(EventsQuery, {
    variables: {filterType, search: ''},
  });

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
        goToNewEvent={() => history.push(RoutePaths.NewEvent())}
      ></EventFilters>
      {loading ? (
        <Spinner />
      ) : data ? (
        <EventsGrid events={data.events} />
      ) : null}
    </div>
  );
};

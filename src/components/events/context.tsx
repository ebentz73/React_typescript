import React, {createContext, ReactNode, useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {EventSchema} from '../../data/schema-types';
import {EventsQueryType, EventsQuery} from '../queries';
import {EventFilterType} from '../../data/schema-types';
import {useDebounce} from 'use-debounce';
import {ArchiveEventMutation} from '../mutations';
import {deleteCacheForQuery} from '../../util/apollo';

interface ContextType {
  state: {
    events: {isLoading: true} | {isLoading: false; events: EventSchema[]};
    filterType: EventFilterType;
    searchQuery: string;
  };
  actions: {
    setFilterType: (filterType: EventFilterType) => void;
    setSearchQuery: (searchQuery: string) => void;
    archiveEvent: (eventId: string, isArchived: boolean) => void;
  };
}

export const EventsContext = createContext<ContextType>({} as any);

interface Props {
  children: ReactNode;
}

export const EventsContextProvider = ({children}: Props) => {
  const [filterType, setFilterType] = useState<EventFilterType>(
    EventFilterType.ALL
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const {data, loading: eventsQueryLoading} = useQuery<EventsQueryType>(
    EventsQuery,
    {
      variables: {filterType, search: debouncedSearchQuery},
    }
  );
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveEvent] = useMutation(ArchiveEventMutation, {
    update: deleteCacheForQuery('events'),
    refetchQueries: [
      {
        query: EventsQuery,
        variables: {filterType, search: debouncedSearchQuery},
      },
    ],
  });

  const service: ContextType = {
    state: {
      events:
        eventsQueryLoading || archiveLoading || !data
          ? {isLoading: true}
          : {isLoading: false, events: data.events},
      filterType,
      searchQuery,
    },
    actions: {
      archiveEvent: async (id, isArchived) => {
        setArchiveLoading(true);
        await archiveEvent({variables: {id, isArchived}});
        setArchiveLoading(false);
      },
      setFilterType,
      setSearchQuery,
    },
  };

  return (
    <EventsContext.Provider value={service}>{children}</EventsContext.Provider>
  );
};

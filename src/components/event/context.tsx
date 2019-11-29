import React, {createContext, ReactNode} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {EventQueryType, EventQuery} from '../queries';
import {EventSchema} from '../../data/schema-types';
import {Spinner} from 'baseui/icon';

interface ContextType {
  event: EventSchema;
}

interface MaybeContextType {
  event: EventSchema | null;
}

export const EventContext = createContext<ContextType>({} as any);
export const MaybeEventContext = createContext<MaybeContextType>({} as any);

interface Props {
  eventId: string;
  children: ReactNode;
}

interface MaybeProps {
  eventId: string | null;
  children: ReactNode;
}

export const MaybeEventContextProvider = ({children, eventId}: MaybeProps) => {
  const {data, loading} = useQuery<EventQueryType>(EventQuery, {
    variables: {id: eventId},
    skip: !eventId,
  });

  const service = {
    event: loading || !data ? null : data.event,
  };
  return (
    <MaybeEventContext.Provider value={service}>
      {children}
    </MaybeEventContext.Provider>
  );
};

export const EventContextProvider = ({children, eventId}: Props) => {
  const {data, loading} = useQuery<EventQueryType>(EventQuery, {
    variables: {id: eventId},
  });

  if (loading || !data) {
    return <Spinner />;
  }

  const service = {
    event: data.event,
  };
  return (
    <EventContext.Provider value={service}>{children}</EventContext.Provider>
  );
};

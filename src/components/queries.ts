import {gql} from 'fusion-plugin-apollo';
import {SessionSchema, EventSchema} from '../data/schema-types';

export const SessionQuery = gql('../data/queries/session.graphql');
export const EventsQuery = gql('../data/queries/events.graphql');
export const EventQuery = gql('../data/queries/event.graphql');

export interface SessionQueryType {
  session: SessionSchema;
}

export interface EventsQueryType {
  events: EventSchema[];
}

export interface EventQueryType {
  event: EventSchema;
}

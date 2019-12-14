import {gql} from 'fusion-plugin-apollo';
import {SessionSchema, EventSchema, VendorSchema} from '../data/schema-types';

export const SessionQuery = gql('../data/queries/session.graphql');
export const EventsQuery = gql('../data/queries/events.graphql');
export const EventQuery = gql('../data/queries/event.graphql');
export const VendorsQuery = gql('../data/queries/vendors.graphql');

export interface SessionQueryType {
  session: SessionSchema;
}

export interface EventsQueryType {
  events: EventSchema[];
}

export interface EventQueryType {
  event: EventSchema;
}

export interface VendorsQueryType {
  event: {
    vendors: VendorSchema[];
  };
}

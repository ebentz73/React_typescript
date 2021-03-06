import {gql} from 'fusion-plugin-apollo';
import {
  SessionSchema,
  EventSchema,
  VendorSchema,
  RichTextSchema,
} from '../data/schema-types';

export const SessionQuery = gql('../data/queries/session.graphql');
export const EventsQuery = gql('../data/queries/events.graphql');
export const EventQuery = gql('../data/queries/event.graphql');
export const VendorsQuery = gql('../data/queries/vendors.graphql');
export const VendorQuery = gql('../data/queries/vendor.graphql');
export const RichTextQuery = gql('../data/queries/richText.graphql');

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

export interface VendorQueryType {
  vendor: VendorSchema;
}

export interface RichTextQueryType {
  richText: RichTextSchema;
}

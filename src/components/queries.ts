import {gql} from 'fusion-plugin-apollo';
import {SessionSchema} from '../data/schema';

export const SessionQuery = gql('../data/queries/session.graphql');
export interface SessionQueryType {
  session: SessionSchema;
}

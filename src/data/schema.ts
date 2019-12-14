import {createPlugin} from 'fusion-core';
import {makeExecutableSchema} from 'graphql-tools';
import {gql} from 'fusion-plugin-apollo';
import {AuthResolversToken} from './resolvers/auth';
import {EventsResolversToken} from './resolvers/events';
import merge from 'deepmerge';
import {VendorsResolversToken} from './resolvers/vendors';

export const SchemaPlugin = createPlugin({
  deps: {
    authResolvers: AuthResolversToken,
    eventsResolvers: EventsResolversToken,
    vendorsResolvers: VendorsResolversToken,
  },
  provides: ({authResolvers, eventsResolvers, vendorsResolvers}) => {
    const resolvers = merge.all([
      authResolvers,
      eventsResolvers,
      vendorsResolvers,
    ]);
    return makeExecutableSchema({typeDefs: gql('./schema.graphql'), resolvers});
  },
});

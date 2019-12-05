import {createPlugin} from 'fusion-core';
import {makeExecutableSchema} from 'graphql-tools';
import {gql} from 'fusion-plugin-apollo';
import {AuthResolversToken} from './resolvers/auth';
import {EventsResolversToken} from './resolvers/events';

export const SchemaPlugin = createPlugin({
  deps: {
    authResolvers: AuthResolversToken,
    eventsResolvers: EventsResolversToken,
  },
  provides: ({authResolvers, eventsResolvers}) => {
    const resolvers = {
      Query: {
        ...authResolvers.Query,
        ...eventsResolvers.Query,
      },
      Mutation: {
        ...authResolvers.Mutation,
        ...eventsResolvers.Mutation,
      },
    };

    return makeExecutableSchema({typeDefs: gql('./schema.graphql'), resolvers});
  },
});

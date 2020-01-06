import {createPlugin} from 'fusion-core';
import {makeExecutableSchema} from 'graphql-tools';
import {gql} from 'fusion-plugin-apollo';
import {AuthResolversToken} from './resolvers/auth';
import {EventsResolversToken} from './resolvers/events';
import merge from 'deepmerge';
import {VendorsResolversToken} from './resolvers/vendors';
import {RichTextResolversToken} from './resolvers/rich-text';

export const SchemaPlugin = createPlugin({
  deps: {
    authResolvers: AuthResolversToken,
    eventsResolvers: EventsResolversToken,
    vendorsResolvers: VendorsResolversToken,
    richTextResolvers: RichTextResolversToken,
  },
  provides: ({
    authResolvers,
    eventsResolvers,
    vendorsResolvers,
    richTextResolvers,
  }) => {
    const resolvers = merge.all([
      authResolvers,
      eventsResolvers,
      vendorsResolvers,
      richTextResolvers,
    ]);
    return makeExecutableSchema({typeDefs: gql('./schema.graphql'), resolvers});
  },
});

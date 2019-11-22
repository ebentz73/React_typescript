import {createPlugin, Context} from 'fusion-core';
import {User, UserDocument} from './models/user';
import {makeExecutableSchema} from 'graphql-tools';
import {gql} from 'fusion-plugin-apollo';
import {SessionAuthToken} from '../plugins/session-auth';

export const SchemaPlugin =
  __NODE__ &&
  createPlugin({
    deps: {sessionAuth: SessionAuthToken},
    provides: ({sessionAuth}) => {
      const typeDefs = gql('./schema.graphql');

      const resolvers = {
        Query: {
          users: () => [],
        },
        Mutation: {
          signup: async (_, {email, password}, ctx: Context) => {
            if (!email || !password) {
              return false;
            }
            const newUser = new User({email, password});
            try {
              await newUser.save();
              sessionAuth.setUserId(ctx, email);
              return true;
            } catch {
              return false;
            }
          },
          logout: (_, __, ctx: Context) => {
            sessionAuth.setUserId(ctx, null);
          },
          login: async (_, {email, password}, ctx: Context) => {
            if (!email || !password) {
              return false;
            }
            const user = (await User.findOne({email}).exec()) as UserDocument;
            if (!user) {
              return false;
            }
            try {
              if (await user.comparePassword(password)) {
                sessionAuth.setUserId(ctx, email);
                return true;
              } else {
                return false;
              }
            } catch {
              return false;
            }
          },
        },
      };

      return makeExecutableSchema({typeDefs, resolvers});
    },
  });

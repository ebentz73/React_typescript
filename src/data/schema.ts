import {createPlugin, Context} from 'fusion-core';
import {UserModelToken, UserDocument} from './models/user';
import {makeExecutableSchema} from 'graphql-tools';
import {gql} from 'fusion-plugin-apollo';
import {SessionAuthToken} from '../plugins/session-auth';
import {EventSchema, SessionSchema} from './schema-types';

export const SessionId = 'session';
const LoggedInSession = {id: SessionId, isLoggedIn: true};
const createInvalidSession = error => ({
  id: SessionId,
  isLoggedIn: false,
  error,
});

export const SchemaPlugin = createPlugin({
  deps: {sessionAuth: SessionAuthToken, UserModel: UserModelToken},
  provides: ({sessionAuth, UserModel}) => {
    const typeDefs = gql('./schema.graphql');

    const resolvers = {
      Query: {
        session: (_, __, ctx: Context): SessionSchema => ({
          id: SessionId,
          isLoggedIn: Boolean(sessionAuth.getUserId(ctx)),
        }),
        events: (): EventSchema[] => {
          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
            id: id.toString(),
            date: new Date(
              2019,
              Math.random() * 11,
              Math.random() * 28
            ).valueOf(),
            name: `Event ${id}`,
            budget: Math.round(Math.random() * 20000),
          }));
        },
      },
      Mutation: {
        signup: async (
          _,
          {email, password},
          ctx: Context
        ): Promise<SessionSchema> => {
          if (!email || !password) {
            return createInvalidSession('Please enter a username and password');
          }
          const newUser = new UserModel({email, password});
          await newUser.save();
          sessionAuth.setUserId(ctx, email);
          return {id: SessionId, isLoggedIn: true};
        },
        logout: (_, __, ctx: Context): SessionSchema => {
          sessionAuth.setUserId(ctx, null);
          return {id: SessionId, isLoggedIn: false};
        },
        login: async (
          _,
          {email, password},
          ctx: Context
        ): Promise<SessionSchema> => {
          if (!email || !password) {
            return createInvalidSession('Please enter a username and password');
          }
          const user = (await UserModel.findOne({
            email,
          }).exec()) as UserDocument;
          if (!user) {
            return createInvalidSession('User does not exist');
          }
          if (await user.comparePassword(password)) {
            sessionAuth.setUserId(ctx, email);
            return LoggedInSession;
          } else {
            return createInvalidSession('Incorrect password');
          }
        },
      },
    };

    return makeExecutableSchema({typeDefs, resolvers});
  },
});

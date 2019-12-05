import {createPlugin, Context, createToken, ServiceType} from 'fusion-core';
import {UserModelToken, UserDocument} from '../models/user';
import {SessionAuthToken} from '../../plugins/session-auth';
import {SessionSchema} from '../schema-types';

export const SessionId = 'session';
const LoggedInSession = {id: SessionId, isLoggedIn: true};
const createInvalidSession = error => ({
  id: SessionId,
  isLoggedIn: false,
  error,
});

export const AuthResolvers = createPlugin({
  deps: {
    sessionAuth: SessionAuthToken,
    UserModel: UserModelToken,
  },
  provides: ({sessionAuth, UserModel}) => {
    return {
      Query: {
        session: (_, __, ctx: Context): SessionSchema => ({
          id: SessionId,
          isLoggedIn: Boolean(sessionAuth.getUserId(ctx)),
        }),
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
          sessionAuth.setUserId(ctx, newUser.id);
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
            sessionAuth.setUserId(ctx, user.id);
            return LoggedInSession;
          } else {
            return createInvalidSession('Incorrect password');
          }
        },
      },
    };
  },
});

export const AuthResolversToken = createToken<
  ServiceType<typeof AuthResolvers>
>('AuthResolvers');

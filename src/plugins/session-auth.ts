import {createPlugin, Context, createToken, SSRDeciderToken} from 'fusion-core';
import {SessionToken} from 'fusion-tokens';

interface SessionAuthType {
  getUserId(ctx: Context): string | null;
  setUserId(ctx: Context, userId: string | null): void;
}

export const SessionAuthToken = createToken<SessionAuthType>('SessionAuth');

export const SessionAuth = createPlugin({
  deps: {Session: SessionToken, ssrDecider: SSRDeciderToken},
  provides: ({Session}) => ({
    getUserId: (ctx: Context): string | null => Session.from(ctx).get('userId'),
    setUserId: (ctx: Context, userId: string): void => {
      Session.from(ctx).set('userId', userId);
    },
  }),
});

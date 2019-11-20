import {createPlugin, Context, createToken, SSRDeciderToken} from 'fusion-core';
import {SessionToken} from 'fusion-tokens';

const ExemptPaths = ['/login', '/api/signup', '/api/login'];

export const SessionAuthToken = createToken('SessionAuth');

export const SessionAuth = createPlugin({
  deps: {Session: SessionToken, ssrDecider: SSRDeciderToken},
  provides: ({Session}) => ({
    getUserId: (ctx: Context): string | null => Session.from(ctx).get('userId'),
  }),
  middleware: ({ssrDecider}, {getUserId}) => {
    return (ctx, next) => {
      if (ExemptPaths.some(p => p === ctx.path)) {
        return next();
      }

      if (!getUserId(ctx)) {
        if (ssrDecider(ctx)) {
          ctx.redirect('/login');
        } else {
          ctx.throw(403, 'Unauthorized');
        }
      }

      return next();
    };
  },
});

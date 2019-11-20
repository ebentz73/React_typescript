// @flow
import App from 'fusion-react';
import Router from 'fusion-plugin-react-router';
import Styletron from 'fusion-plugin-styletron-react';
import root from './components/root';
import mongoose from 'mongoose';
import {MONGODB_URI, SESSION_SECRET} from './config/secrets';
import JWTSession, {
  SessionSecretToken,
  SessionCookieNameToken,
  SessionCookieExpiresToken,
} from 'fusion-plugin-jwt';
import {SessionToken} from 'fusion-tokens';
import {SessionAuth, SessionAuthToken} from './plugins/session-auth';

export default () => {
  if (__NODE__) {
    // @ts-ignore
    mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
  }

  const app = new App(root);
  app.register(Styletron);
  app.register(Router);
  if (__NODE__) {
    app.register(SessionAuthToken, SessionAuth);
    app.register(SessionToken, JWTSession);
    app.register(SessionSecretToken, SESSION_SECRET);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(SessionCookieExpiresToken, 604800); // 1 week
  }

  return app;
};

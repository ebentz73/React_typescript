// @flow
import App from 'fusion-react';
import Router from 'fusion-plugin-react-router';
import Styletron from 'fusion-plugin-styletron-react';
import root from './components/root';
import JWTSession, {
  SessionSecretToken,
  SessionCookieNameToken,
  SessionCookieExpiresToken,
} from 'fusion-plugin-jwt';
import {SessionToken, FetchToken} from 'fusion-tokens';
import {SessionAuth, SessionAuthToken} from './plugins/session-auth';
import {
  ApolloRenderEnhancer,
  ApolloClientPlugin,
  ApolloClientToken,
  GraphQLSchemaToken,
} from 'fusion-plugin-apollo';
import {RenderToken, createPlugin} from 'fusion-core';
import {SchemaPlugin} from './data/schema';
import {MongooseToken, MongoosePlugin} from './data/mongoose';
import {SecretsToken, SecretsPlugin} from './config/secrets';
import {UserModelToken, UserModel} from './data/models/User';
import unfetch from 'unfetch';

const setUpServer = app => {
  app.register(SecretsToken, SecretsPlugin);
  app.register(MongooseToken, MongoosePlugin);
  app.register(GraphQLSchemaToken, SchemaPlugin);
  app.register(SessionAuthToken, SessionAuth);
  app.register(SessionToken, JWTSession);
  app.register(
    SessionSecretToken,
    createPlugin({
      deps: {secrets: SecretsToken},
      provides: ({secrets}) => secrets.SessionSecret,
    })
  );
  app.register(SessionCookieNameToken, 'jwt-session');
  app.register(SessionCookieExpiresToken, 604800); // 1 week

  // Models
  app.register(UserModelToken, UserModel);
};

export default () => {
  const app = new App(root);
  app.register(Styletron);
  app.register(Router);
  app.enhance(RenderToken, ApolloRenderEnhancer);
  app.register(ApolloClientToken, ApolloClientPlugin);
  app.register(FetchToken, unfetch);
  if (__NODE__) {
    setUpServer(app);
  }

  return app;
};

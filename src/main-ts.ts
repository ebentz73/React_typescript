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
import {UserModelToken, UserModel} from './data/models/user';
import unfetch from 'unfetch';
import {BudgetItemModel, BudgetItemModelToken} from './data/models/budget-item';
import {
  ChecklistTemplateModel,
  ChecklistTemplateModelToken,
} from './data/models/checklist-template';
import {ContactModel, ContactModelToken} from './data/models/contact';
import {EventModelToken, EventModel} from './data/models/event';
import {ModelMapToken, ModelMap} from './data/models/model-map';
import {
  PaymentScheduleModelToken,
  PaymentScheduleModel,
} from './data/models/payment-schedule';
import {
  TimelineItemModelToken,
  TimelineItemModel,
} from './data/models/timeline-item';
import {
  TimelineSnippetModelToken,
  TimelineSnippetModel,
} from './data/models/timeline-snippet';
import {VendorModelToken, VendorModel} from './data/models/vendor';
import {
  ChecklistServiceToken,
  ChecklistService,
} from './data/services/checklist';
import {
  EventItemsService,
  EventItemsServiceToken,
} from './data/services/event-items';
import {EventServiceToken, EventService} from './data/services/event';
import {
  TimelineItemService,
  TimelineItemServiceToken,
} from './data/services/timeline-item';
import {VendorService, VendorServiceToken} from './data/services/vendor';

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
  app.register(BudgetItemModelToken, BudgetItemModel);
  app.register(ChecklistTemplateModelToken, ChecklistTemplateModel);
  app.register(ContactModelToken, ContactModel);
  app.register(EventModelToken, EventModel);
  app.register(ModelMapToken, ModelMap);
  app.register(PaymentScheduleModelToken, PaymentScheduleModel);
  app.register(TimelineItemModelToken, TimelineItemModel);
  app.register(TimelineSnippetModelToken, TimelineSnippetModel);
  app.register(VendorModelToken, VendorModel);

  // Services
  app.register(ChecklistServiceToken, ChecklistService);
  app.register(EventItemsServiceToken, EventItemsService);
  app.register(EventServiceToken, EventService);
  app.register(TimelineItemServiceToken, TimelineItemService);
  app.register(VendorServiceToken, VendorService);
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

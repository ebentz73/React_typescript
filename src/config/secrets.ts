/* eslint-env node */
import dotenv from 'dotenv';
import fs from 'fs';
import {createToken, createPlugin} from 'fusion-core';
import {unwrap} from '../util';

export const SecretsPlugin = createPlugin({
  provides: () => {
    if (fs.existsSync('.env')) {
      dotenv.config({path: '.env'});
    } else {
      dotenv.config({path: '.env.example'});
    }

    const ENVIRONMENT = process.env.NODE_ENV;
    const isProd = !__DEV__ && ENVIRONMENT === 'production';

    const SessionSecret = unwrap(process.env['SESSION_SECRET']);
    const MongoDbURI = unwrap(
      isProd ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL']
    );
    const StorageConnectionString = unwrap(
      process.env['STORAGE_CONNECTION_STRING']
    );

    const SendgridUser = process.env.SENDGRID_USER;
    const SendgridPassword = process.env.SENDGRID_PASSWORD;

    return {
      isProd,
      SessionSecret,
      MongoDbURI,
      StorageConnectionString,
      SendgridUser,
      SendgridPassword,
    };
  },
});

export const SecretsToken = createToken<
  ReturnType<typeof SecretsPlugin.provides>
>('Secrets');

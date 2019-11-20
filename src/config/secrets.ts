/* eslint-env node */
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  dotenv.config({path: '.env'});
} else {
  dotenv.config({path: '.env.example'});
}

const ENVIRONMENT = process.env.NODE_ENV;
export const isProd = !__DEV__ && ENVIRONMENT === 'production';

export const SESSION_SECRET = process.env['SESSION_SECRET'];
export const MONGODB_URI = isProd
  ? process.env['MONGODB_URI']
  : process.env['MONGODB_URI_LOCAL'];
export const STORAGE_CONNECTION_STRING =
  process.env['STORAGE_CONNECTION_STRING'];

export const SENDGRID_USER = process.env.SENDGRID_USER;
export const SENDGRID_PASSWORD = process.env.SENDGRID_PASSWORD;

if (!SESSION_SECRET || !MONGODB_URI || !STORAGE_CONNECTION_STRING) {
  console.log('MISSING THINGS');
  process.exit(1);
}

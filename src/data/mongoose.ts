import {createToken, createPlugin} from 'fusion-core';
import {SecretsToken} from '../config/secrets';
import {Mongoose} from 'mongoose';

export const MongoosePlugin = createPlugin({
  deps: {secrets: SecretsToken},
  provides: ({secrets}) => {
    const mongoose = require('mongoose') as Mongoose;
    mongoose.Promise = Promise;
    mongoose.connect(secrets.MongoDbURI, {useNewUrlParser: true});

    return mongoose;
  },
});
export const MongooseToken = createToken<
  ReturnType<typeof MongoosePlugin.provides>
>('Mongoose');

import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export type ContactDocument = Document & {
  name: string;
  phone: string;
  email: string;
};

export const ContactModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'Contact',
      new mongoose.Schema(
        {
          name: String,
          phone: String,
          email: String,
        },
        {timestamps: true}
      )
    ),
});
export const ContactModelToken = createToken<ServiceType<typeof ContactModel>>(
  'ContactModel'
);

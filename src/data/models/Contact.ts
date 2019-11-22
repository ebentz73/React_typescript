import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export type ContactDocument = Document & {
  name: string;
  phone: string;
  email: string;
  notes: string;
  vendorId: string;
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
          notes: String,
          vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
          },
        },
        {timestamps: true}
      )
    ),
});
export const ContactModelToken = createToken<ServiceType<typeof ContactModel>>(
  'ContactModel'
);

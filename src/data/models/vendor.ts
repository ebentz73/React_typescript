import {UserDocument} from './user';
import {Document, Model} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';
import {VendorKinds} from '../../constants/vendor-kind';
import {ContactDocument} from './contact';
import {EventDocument} from './event';
import {VendorContactKind} from '../../constants/vendor-contact-kind';

export type VendorDocument = Document & {
  name: string;
  vendorKind: VendorKinds;
  location: string;
  creator: UserDocument;
  contacts: {
    contact: ContactDocument;
    contactKind: VendorContactKind;
  }[];
  event: EventDocument;
};

export const VendorModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'Vendor',
      new mongoose.Schema(
        {
          name: {type: String, required: true},
          vendorKind: {
            type: String,
            required: true,
            enum: Object.values(VendorKinds),
          },
          location: {type: String, required: true},
          creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
          },
          contacts: [
            {
              contact: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Contact',
              },
              contactKind: {
                type: String,
                required: true,
                enum: Object.values(VendorContactKind),
              },
            },
          ],
          event: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Event',
          },
        },
        {timestamps: true}
      )
    ) as Model<VendorDocument, {}>,
});
export const VendorModelToken = createToken<ServiceType<typeof VendorModel>>(
  'VendorModel'
);

import {UserDocument} from './user';
import {VENDOR_KINDS} from '../../constants/vendor-kind';
import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export type VendorDocument = Document & {
  name: string;
  vendorKind: string;
  creator: UserDocument;
  events: string[];
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
            default: VENDOR_KINDS.DEFAULT,
            enum: Object.values(VENDOR_KINDS),
          },
          creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          events: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Event',
            },
          ],
        },
        {timestamps: true}
      )
    ),
});
export const VendorModelToken = createToken<ServiceType<typeof VendorModel>>(
  'VendorModel'
);

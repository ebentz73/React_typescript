import mongoose from 'mongoose';
import {UserDocument} from './user';
import {VENDOR_KINDS} from '../../constants/vendor-kind';
import {Document, Schema} from 'mongoose';

export type VendorDocument = Document & {
  name: string;
  vendorKind: string;
  creator: UserDocument;
  events: string[];
};

const vendorSchema = new Schema(
  {
    name: {type: String, required: true},
    vendorKind: {
      type: String,
      required: true,
      default: VENDOR_KINDS.DEFAULT,
      enum: Object.values(VENDOR_KINDS),
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
  },
  {timestamps: true}
);

export const Vendor = mongoose.model('Vendor', vendorSchema);

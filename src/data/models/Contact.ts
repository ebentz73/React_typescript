import mongoose, {Document, Schema} from 'mongoose';

export type ContactDocument = Document & {
  name: string;
  phone: string;
  email: string;
  notes: string;
  vendorId: string;
};

const contactSchema = new Schema(
  {
    name: String,
    phone: String,
    email: String,
    notes: String,
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
    },
  },
  {timestamps: true}
);

export const Contact = mongoose.model('Contact', contactSchema);

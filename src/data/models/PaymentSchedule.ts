import mongoose, {Schema, Document} from 'mongoose';

export type PaymentScheduleDocument = Document & {
  item: string;
  amount: number;
  dueDate: string;
  vendorId: string;
};

const paymentScheduleSchema = new Schema(
  {
    item: String,
    amount: Number,
    dueDate: String,
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
    },
  },
  {timestamps: true}
);

export const PaymentSchedule = mongoose.model(
  'PaymentSchedule',
  paymentScheduleSchema
);

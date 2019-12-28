import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';
import {VendorDocument} from './vendor';

export type PaymentScheduleDocument = Document & {
  item: string;
  description: string;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
  vendor: VendorDocument;
};

export const PaymentScheduleModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'PaymentSchedule',
      new mongoose.Schema(
        {
          item: String,
          description: String,
          dueDate: Date,
          amount: Number,
          isPaid: Boolean,
          vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
          },
        },
        {timestamps: true}
      )
    ),
});
export const PaymentScheduleModelToken = createToken<
  ServiceType<typeof PaymentScheduleModel>
>('PaymentScheduleModel');

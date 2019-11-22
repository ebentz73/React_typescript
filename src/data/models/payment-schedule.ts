import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export type PaymentScheduleDocument = Document & {
  item: string;
  amount: number;
  dueDate: string;
  vendorId: string;
};

export const PaymentScheduleModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'PaymentSchedule',
      new mongoose.Schema(
        {
          item: String,
          amount: Number,
          dueDate: String,
          vendorId: {
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

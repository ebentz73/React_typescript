import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export type BudgetItemDocument = Document & {
  item: string;
  qty: number;
  amount: number;
  total: number;
  vendorId: string;
};

export const BudgetItemModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'BudgetItem',
      new mongoose.Schema(
        {
          item: String,
          qty: Number,
          amount: Number,
          total: Number,
          vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
          },
        },
        {timestamps: true}
      )
    ),
});
export const BudgetItemModelToken = createToken<
  ServiceType<typeof BudgetItemModel>
>('BudgetItemModel');

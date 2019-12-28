import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';
import {VendorDocument} from './vendor';

export type BudgetItemDocument = Document & {
  item: string;
  quantity: number;
  amount: number;
  vendor: VendorDocument;
};

export const BudgetItemModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'BudgetItem',
      new mongoose.Schema(
        {
          item: String,
          quantity: Number,
          amount: Number,
          vendor: {
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

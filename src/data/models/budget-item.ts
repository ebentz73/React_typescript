import {Schema, Document} from 'mongoose';
import {createPlugin} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export type BudgetItemDocument = Document & {
  item: string;
  qty: number;
  amount: number;
  total: number;
  vendorId: string;
};

export const BudgetItem = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'BudgetItem',
      new Schema(
        {
          item: String,
          qty: Number,
          amount: Number,
          total: Number,
          vendorId: {
            type: Schema.Types.ObjectId,
            ref: 'Vendor',
          },
        },
        {timestamps: true}
      )
    ),
});

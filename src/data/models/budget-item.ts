import mongoose, {Schema, Document} from 'mongoose';

export type BudgetItemDocument = Document & {
  item: string;
  qty: number;
  amount: number;
  total: number;
  vendorId: string;
};

const budgetItemSchema = new Schema(
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
);

export const BudgetItem = mongoose.model('BudgetItem', budgetItemSchema);

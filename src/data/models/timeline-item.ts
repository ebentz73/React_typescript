import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';
import {VendorDocument} from './vendor';

export type TimelineItemDocument = Document & {
  date: Date;
  description: string;
  vendor: VendorDocument;
};

export const TimelineItemModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model<TimelineItemDocument>(
      'TimelineItem',
      new mongoose.Schema(
        {
          date: Date,
          description: String,
          vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
          },
        },
        {timestamps: true}
      )
    ),
});
export const TimelineItemModelToken = createToken<
  ServiceType<typeof TimelineItemModel>
>('TimelineItemModel');

import {Document} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export type TimelineItemDocument = Document & {
  date: string;
  startTime: string;
  description: string;
  location: string;
  weddingParty: boolean;
  vendorId: string;
};

export const TimelineItemModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model<TimelineItemDocument>(
      'TimelineItem',
      new mongoose.Schema(
        {
          date: String,
          startTime: String,
          description: String,
          location: String,
          weddingParty: {
            type: Boolean,
            default: true,
          },
          vendorId: {
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

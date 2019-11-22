import mongoose, {Schema, Document} from 'mongoose';

export type TimelineItemDocument = Document & {
  date: string;
  startTime: string;
  description: string;
  location: string;
  weddingParty: boolean;
  vendorId: string;
};

const timelineItemSchema = new Schema(
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
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
    },
  },
  {timestamps: true}
);

export const TimelineItem = mongoose.model<TimelineItemDocument>(
  'TimelineItem',
  timelineItemSchema
);

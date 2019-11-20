import mongoose, {Schema} from 'mongoose';

const timelineSnippetSchema = new Schema({
  name: String,
  timelineItems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'TimelineItem',
    },
  ],
});

export const TimelineSnippet = mongoose.model(
  'TimelineSnippet',
  timelineSnippetSchema
);

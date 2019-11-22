import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export const TimelineSnippetModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'TimelineSnippet',
      new mongoose.Schema({
        name: String,
        timelineItems: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimelineItem',
          },
        ],
      })
    ),
});
export const TimelineSnippetModelToken = createToken<
  ServiceType<typeof TimelineSnippetModel>
>('TimelineSnippetModel');

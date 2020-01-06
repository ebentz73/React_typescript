import {Document, Model} from 'mongoose';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';
import {EventDocument} from './event';

export type RichTextDocument = Document & {
  data: string;
  event: EventDocument;
};

export const RichTextModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'RichText',
      new mongoose.Schema(
        {
          data: String,
          event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
          },
        },
        {timestamps: true}
      )
    ) as Model<RichTextDocument, {}>,
});
export const RichTextModelToken = createToken<
  ServiceType<typeof RichTextModel>
>('RichTextModel');

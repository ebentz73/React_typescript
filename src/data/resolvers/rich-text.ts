import {createPlugin, Context, createToken, ServiceType} from 'fusion-core';
import {RichTextModelToken, RichTextDocument} from '../models/rich-text';
import {RichTextSchema, RichTextInput} from '../schema-types';
import {unwrap} from '../../util';
import {SessionAuthToken} from '../../plugins/session-auth';
import {EventServiceToken} from '../services/event';

export const RichTextResolvers = createPlugin({
  deps: {
    RichTextModel: RichTextModelToken,
    sessionAuth: SessionAuthToken,
    EventService: EventServiceToken,
  },
  provides: ({RichTextModel, sessionAuth, EventService}) => {
    const getUserId = ctx => unwrap(sessionAuth.getUserId(ctx));
    const findById = async (richTextId: string, userId: string) => {
      const richText = unwrap(await RichTextModel.findById(richTextId).exec());
      await EventService.findById(richText.event, userId);
      return richText;
    };
    const getRichTextSchema = (richText: RichTextDocument) => ({
      id: richText.id,
      data: richText.data,
    });

    return {
      Query: {
        richText: async (
          _,
          {id}: {id: string},
          ctx: Context
        ): Promise<RichTextSchema> => {
          return getRichTextSchema(await findById(id, getUserId(ctx)));
        },
      },
      Mutation: {
        upsertRichText: async (
          _,
          {richText}: {richText: RichTextInput},
          ctx: Context
        ): Promise<RichTextSchema> => {
          let richTextDocument: RichTextDocument;
          if (richText.id) {
            richTextDocument = await findById(richText.id, getUserId(ctx));
          } else {
            richTextDocument = new RichTextModel({
              event: unwrap(richText.eventId),
            });
          }

          richTextDocument.data = richText.data;
          await richTextDocument.save();

          return getRichTextSchema(richTextDocument);
        },
      },
    };
  },
});

export const RichTextResolversToken = createToken<
  ServiceType<typeof RichTextResolvers>
>('RichTextResolvers');

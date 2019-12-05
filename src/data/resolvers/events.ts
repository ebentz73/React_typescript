import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {UserModelToken, UserDocument} from '../models/user';
import {SessionAuthToken} from '../../plugins/session-auth';
import {EventSchema, EventFilterType} from '../schema-types';
import {EventServiceToken} from '../services/event';
import {EVENT_STATUS} from '../../constants/model-constants';
import {unwrap} from '../../util';

export const EventsResolvers = createPlugin({
  deps: {
    sessionAuth: SessionAuthToken,
    UserModel: UserModelToken,
    eventService: EventServiceToken,
  },
  provides: ({sessionAuth, UserModel, eventService}) => {
    const getUserId = ctx => unwrap(sessionAuth.getUserId(ctx));
    const getUser = async ctx =>
      unwrap(await UserModel.findById(getUserId(ctx)).exec()) as UserDocument;
    const getEventSchema = eventDocument => ({
      id: eventDocument.id,
      name: eventDocument.name,
      date: eventDocument.date.valueOf(),
      budget: eventDocument.budget,
      isArchived: eventDocument.status === EVENT_STATUS.ARCHIVED,
    });

    return {
      Query: {
        event: async (_, {id}, ctx): Promise<EventSchema> => {
          const event = await eventService.findById(id, getUserId(ctx));
          return getEventSchema(event);
        },
        events: async (
          _,
          {search, filterType},
          ctx
        ): Promise<EventSchema[]> => {
          return (await eventService.findAll(
            getUserId(ctx),
            filterType === EventFilterType.ARCHIVED
          ))
            .filter(
              e => e.name.toUpperCase().indexOf(search.toUpperCase()) !== -1
            )
            .map(getEventSchema);
        },
      },
      Mutation: {
        createEvent: async (_, {event}, ctx): Promise<EventSchema> => {
          const newEvent = await eventService.create(event, await getUser(ctx));
          return getEventSchema(newEvent);
        },
        archiveEvent: async (
          _,
          {id, isArchived},
          ctx
        ): Promise<EventSchema> => {
          const updatedEvent = await eventService.archive(
            id,
            isArchived,
            getUserId(ctx)
          );
          return getEventSchema(updatedEvent);
        },
      },
    };
  },
});

export const EventsResolversToken = createToken<
  ServiceType<typeof EventsResolvers>
>('EventsResolvers');

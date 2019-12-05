import {EVENT_STATUS} from '../../constants/model-constants';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {ContactModelToken} from '../models/contact';
import {EventModelToken} from '../models/event';
import {EventInput} from '../schema-types';
import {UserDocument} from '../models/user';
import {unwrap} from '../../util';

export const EventService = createPlugin({
  deps: {
    ContactModel: ContactModelToken,
    EventModel: EventModelToken,
  },
  provides: ({ContactModel, EventModel}) => {
    const findById = async (eventId, userId) => {
      const event = unwrap(await EventModel.findById(eventId).exec());
      if (event.creator.toString() !== userId) {
        console.log(`creatorID: ${event.creator} userId: ${userId}`);
        throw new Error('Unauthorized');
      }
      return event;
    };

    return {
      create: async (eventInput: EventInput, user: UserDocument) => {
        const clients = await ContactModel.insertMany(
          eventInput.clients.map(c => ({
            name: c.name,
            email: c.email,
            phone: c.phone,
          }))
        );
        const event = new EventModel({
          name: eventInput.name,
          date: eventInput.date,
          creator: user,
          budget: eventInput.budget,
          clients,
        });
        return await event.save();
      },
      findById,
      findAll: async (userId: string, isArchived: boolean) => {
        return await EventModel.find({
          creator: userId,
          status: isArchived ? EVENT_STATUS.ARCHIVED : EVENT_STATUS.ACTIVE,
        }).exec();
      },
      archive: async (eventId: string, isArchived: boolean, userId: string) => {
        const event = await findById(eventId, userId);
        event.status = isArchived ? EVENT_STATUS.ARCHIVED : EVENT_STATUS.ACTIVE;
        return await event.save();
      },
    };
  },
});
export const EventServiceToken = createToken<ServiceType<typeof EventService>>(
  'EventService'
);

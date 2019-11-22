import {EVENT_STATUS} from '../../constants/model-constants';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {ModelMapToken} from '../models/model-map';
import {ContactModelToken} from '../models/contact';
import {EventModelToken} from '../models/event';

export const EventService = createPlugin({
  deps: {
    modelMap: ModelMapToken,
    ContactModel: ContactModelToken,
    EventModel: EventModelToken,
  },
  provides: ({modelMap, ContactModel, EventModel}) => ({
    create: async (reqBody, user) => {
      return ContactModel.find({
        name: reqBody.clientName,
        email: reqBody.email,
      }).then(contacts => {
        if (contacts.length === 0) {
          const newContact = new ContactModel({
            name: reqBody.clientName,
            email: reqBody.email,
            phone: reqBody.phone,
          });
          const event = new EventModel({
            name: reqBody.name,
            date: reqBody.date,
            creator: user,
            client: newContact._id,
          });

          return newContact.save().then(() => event);
        } else {
          const event = new EventModel({
            name: reqBody.name,
            date: reqBody.date,
            creator: user,
            client: contacts[0]._id,
          });

          return event.save();
        }
      });
    },
    readAndPopulate(eventId) {
      return EventModel.findById(eventId)
        .populate('creator')
        .populate('client')
        .populate('vendors')
        .populate('contacts')
        .populate('budgetItems')
        .populate('paymentSchedules')
        .populate('timelineItems');
    },
    findAllAndPopulate(userId) {
      return EventModel.find({
        creator: userId,
        status: EVENT_STATUS.ACTIVE,
      })
        .populate('creator')
        .populate('client')
        .populate('vendors')
        .populate('contacts')
        .populate('budgetItems')
        .populate('paymentSchedules')
        .populate('timelineItems');
    },
    update(event, reqBody) {
      const updatedEvent = Object.assign(event, reqBody);
      return updatedEvent.save();
    },
    remove(event) {
      const items = Object.keys(modelMap);

      return Promise.all(
        items.map(item =>
          Promise.all(
            event[`${item}s`].map(itemId =>
              modelMap[item].findByIdAndDelete(itemId)
            )
          )
        )
      ).then(() => event.remove());
    },
    archive(event) {
      event.status = EVENT_STATUS.ARCHIVED;
      return event.save();
    },
    getEventById(eventId) {
      return EventModel.findById(eventId).then(currentEvent => {
        if (!currentEvent) {
          throw new Error('Event is not found');
        }
        return currentEvent;
      });
    },
  }),
});
export const EventServiceToken = createToken<ServiceType<typeof EventService>>(
  'EventService'
);

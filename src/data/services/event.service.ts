import {Event} from '../models/Event';
import {Contact} from '../models/Contact';
import {modelMap} from '../../constants/model-map';
import {EVENT_STATUS} from '../../constants/model-constants';

export async function create(reqBody, user) {
  return Contact.find({
    name: reqBody.clientName,
    email: reqBody.email,
  }).then(contacts => {
    if (contacts.length === 0) {
      const newContact = new Contact({
        name: reqBody.clientName,
        email: reqBody.email,
        phone: reqBody.phone,
      });
      const event = new Event({
        name: reqBody.name,
        date: reqBody.date,
        creator: user,
        client: newContact._id,
      });

      return newContact.save().then(() => event);
    } else {
      const event = new Event({
        name: reqBody.name,
        date: reqBody.date,
        creator: user,
        client: contacts[0]._id,
      });

      return event.save();
    }
  });
}

export function readAndPopulate(eventId) {
  return Event.findById(eventId)
    .populate('creator')
    .populate('client')
    .populate('vendors')
    .populate('contacts')
    .populate('budgetItems')
    .populate('paymentSchedules')
    .populate('timelineItems');
}

export function findAllAndPopulate(userId) {
  return Event.find({
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
}

export function update(event, reqBody) {
  const updatedEvent = Object.assign(event, reqBody);

  return updatedEvent.save();
}

export function remove(event) {
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
}

export function archive(event) {
  event.status = EVENT_STATUS.ARCHIVED;

  return event.save();
}

export function getEventById(eventId) {
  return Event.findById(eventId).then(currentEvent => {
    if (!currentEvent) {
      throw new Error('Event is not found');
    }

    return currentEvent;
  });
}

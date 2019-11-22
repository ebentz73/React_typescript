import _ from 'lodash';
import {Vendor} from '../models/vendor';
import {Contact} from '../models/contact';
import {BudgetItem} from '../models/budget-item';
import {TimelineItem} from '../models/timeline-item';
import {PaymentSchedule} from '../models/payment-schedule';

export function create(reqBody, currentEvent, user) {
  const vendor = new Vendor({
    name: reqBody.name,
    vendorKind: reqBody.vendorKind,
    creator: user._id,
    events: [currentEvent._id],
  });

  return vendor.save().then(newVendor => {
    currentEvent.vendors.push(newVendor._id);

    return currentEvent.save().then(() => newVendor);
  });
}

function getItemsForVendor(Items, Model, vendorId) {
  return Promise.all(
    Items.map(itemId => {
      return Model.findById(itemId).then(currentItem => {
        if (currentItem.vendorId.equals(vendorId)) {
          return currentItem._id;
        }

        return null;
      });
    })
  ).then(items => _.compact(items));
}

function mutateCurrentEvent(currentEvent, itemName, itemIdsForVendor) {
  return _.reduce(
    itemIdsForVendor,
    (lastResult, itemId) => {
      return lastResult.then(() => {
        currentEvent[itemName].pull(itemId);

        return true;
      });
    },
    Promise.resolve()
  );
}

export function remove(vendor, currentEvent) {
  currentEvent.vendors.pull(vendor._id);

  return Promise.all([
    getItemsForVendor(currentEvent.contacts, Contact, vendor._id),
    getItemsForVendor(currentEvent.budgetItems, BudgetItem, vendor._id),
    getItemsForVendor(
      currentEvent.paymentSchedules,
      PaymentSchedule,
      vendor._id
    ),
    getItemsForVendor(currentEvent.timelineItems, TimelineItem, vendor._id),
  ])
    .then(
      ([contactIds, budgetItemIds, paymentScheduleIds, timelineItemIds]) => {
        return mutateCurrentEvent(currentEvent, 'contacts', contactIds)
          .then(() =>
            mutateCurrentEvent(currentEvent, 'budgetItems', budgetItemIds)
          )
          .then(() =>
            mutateCurrentEvent(
              currentEvent,
              'paymentSchedules',
              paymentScheduleIds
            )
          )
          .then(() =>
            mutateCurrentEvent(currentEvent, 'timelineItems', timelineItemIds)
          );
      }
    )
    .then(() => currentEvent.save());
}

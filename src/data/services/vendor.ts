import _ from 'lodash';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {VendorModelToken} from '../models/vendor';
import {ContactModelToken} from '../models/contact';
import {BudgetItemModelToken} from '../models/budget-item';
import {TimelineItemModelToken} from '../models/timeline-item';
import {PaymentScheduleModelToken} from '../models/payment-schedule';

export const VendorService = createPlugin({
  deps: {
    VendorModel: VendorModelToken,
    ContactModel: ContactModelToken,
    BudgetItemModel: BudgetItemModelToken,
    TimelineItemModel: TimelineItemModelToken,
    PaymentScheduleModel: PaymentScheduleModelToken,
  },
  provides: ({
    VendorModel,
    ContactModel,
    BudgetItemModel,
    TimelineItemModel,
    PaymentScheduleModel,
  }) => {
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

    return {
      create(reqBody, currentEvent, user) {
        const vendor = new VendorModel({
          name: reqBody.name,
          vendorKind: reqBody.vendorKind,
          creator: user._id,
          events: [currentEvent._id],
        });

        return vendor.save().then(newVendor => {
          currentEvent.vendors.push(newVendor._id);

          return currentEvent.save().then(() => newVendor);
        });
      },
      remove(vendor, currentEvent) {
        currentEvent.vendors.pull(vendor._id);

        return Promise.all([
          getItemsForVendor(currentEvent.contacts, ContactModel, vendor._id),
          getItemsForVendor(
            currentEvent.budgetItems,
            BudgetItemModel,
            vendor._id
          ),
          getItemsForVendor(
            currentEvent.paymentSchedules,
            PaymentScheduleModel,
            vendor._id
          ),
          getItemsForVendor(
            currentEvent.timelineItems,
            TimelineItemModel,
            vendor._id
          ),
        ])
          .then(
            ([
              contactIds,
              budgetItemIds,
              paymentScheduleIds,
              timelineItemIds,
            ]) => {
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
                  mutateCurrentEvent(
                    currentEvent,
                    'timelineItems',
                    timelineItemIds
                  )
                );
            }
          )
          .then(() => currentEvent.save());
      },
    };
  },
});
export const VendorServiceToken = createToken<
  ServiceType<typeof VendorService>
>('VendorService');

import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {ModelMapToken} from '../models/model-map';

export const EventItemsService = createPlugin({
  deps: {modelMap: ModelMapToken},
  provides: ({modelMap}) => ({
    create(Event, fields, itemName) {
      const ItemModel = modelMap[itemName];
      const item = new ItemModel(fields);

      return item.save().then(currentItem => {
        Event[`${itemName}s`].push(currentItem._id);

        return Event.save().then(() => currentItem);
      });
    },
    update(item, reqBody) {
      const updatedItem = Object.assign(item, reqBody);

      return updatedItem.save();
    },
    remove(Event, item, itemName) {
      Event[`${itemName}s`].pull(item._id);

      return Promise.all([item.delete(), Event.save()]);
    },
  }),
});
export const EventItemsServiceToken = createToken<
  ServiceType<typeof EventItemsService>
>('EventItemsService');

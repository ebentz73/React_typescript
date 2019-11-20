import {modelMap} from '../../constants/model-map';

export function create(Event, fields, itemName) {
  const ItemModel = modelMap[itemName];
  const item = new ItemModel(fields);

  return item.save().then(currentItem => {
    Event[`${itemName}s`].push(currentItem._id);

    return Event.save().then(() => currentItem);
  });
}

export function update(item, reqBody) {
  const updatedItem = Object.assign(item, reqBody);

  return updatedItem.save();
}

export function remove(Event, item, itemName) {
  Event[`${itemName}s`].pull(item._id);

  return Promise.all([item.delete(), Event.save()]);
}

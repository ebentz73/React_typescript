import _ from 'lodash';
import {ChecklistTemplate} from '../models/ChecklistTemplate';
import {ChecklistItem} from '../models/Event';

export async function create(event, reqBody) {
  const newChecklist = {
    name: reqBody.name,
    checklistItems: [],
  };
  event.checklists.push(newChecklist);
  await event.save();
  // return newly created event - should always be on the end
  return event.checklists[event.checklists.length - 1];
}

export function remove(event, checklistId) {
  event.checklists.pull(checklistId);

  return event.save();
}

export async function createItem(event, checklist, reqBody) {
  const newItem = {
    text: reqBody.text,
    checked: reqBody.checked,
  };

  checklist.checklistItems.push(newItem);

  await event.save();
  return checklist.checklistItems[checklist.checklistItems.length - 1];
}

export function removeItem(event, checklist, itemId) {
  checklist.checklistItems.pull(itemId);

  return event.save();
}

export async function updateItem(event, checklist, itemId, reqBody) {
  const items: ChecklistItem[] = checklist.checklistItems;
  const index = items.findIndex(item => item.id === itemId);

  items[index] = {
    ...items[index],
    ...reqBody,
  };
  await event.save();
  return items[index];
}

export function createTemplate(checklist, reqBody) {
  const extractedChecklist = _.omit(checklist, '_id');
  const newTemplate = new ChecklistTemplate({
    ...extractedChecklist,
    templateName: reqBody.templateName,
  });

  return newTemplate.save();
}

export function copyTemplate(event, templateId) {
  return ChecklistTemplate.findById(templateId).then(checklistTemplate => {
    const copiedChecklist = _.omit(checklistTemplate, ['_id', 'templateName']);

    event.checklists.push(copiedChecklist);

    return event.save().then(savedEvent => savedEvent.checklists);
  });
}

export function readTemplate(templateId) {
  return ChecklistTemplate.findById(templateId);
}

export function listTemplates() {
  return ChecklistTemplate.find().select('_id templateName');
}

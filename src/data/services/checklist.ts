import _ from 'lodash';
import {ChecklistTemplateModelToken} from '../models/checklist-template';
import {ChecklistItem} from '../models/event';
import {createPlugin, createToken, ServiceType} from 'fusion-core';

export const ChecklistService = createPlugin({
  deps: {
    ChecklistTemplateModel: ChecklistTemplateModelToken,
  },
  provides: ({ChecklistTemplateModel}) => ({
    create: async (event, reqBody) => {
      const newChecklist = {
        name: reqBody.name,
        checklistItems: [],
      };
      event.checklists.push(newChecklist);
      await event.save();
      return event.checklists[event.checklists.length - 1];
    },
    remove(event, checklistId) {
      event.checklists.pull(checklistId);
      return event.save();
    },
    createItem: async (event, checklist, reqBody) => {
      const newItem = {
        text: reqBody.text,
        checked: reqBody.checked,
      };

      checklist.checklistItems.push(newItem);

      await event.save();
      return checklist.checklistItems[checklist.checklistItems.length - 1];
    },
    removeItem(event, checklist, itemId) {
      checklist.checklistItems.pull(itemId);
      return event.save();
    },
    updateItem: async (event, checklist, itemId, reqBody) => {
      const items: ChecklistItem[] = checklist.checklistItems;
      const index = items.findIndex(item => item.id === itemId);

      items[index] = {
        ...items[index],
        ...reqBody,
      };
      await event.save();
      return items[index];
    },
    createTemplate(checklist, reqBody) {
      const extractedChecklist = _.omit(checklist, '_id');
      const newTemplate = new ChecklistTemplateModel({
        ...extractedChecklist,
        templateName: reqBody.templateName,
      });

      return newTemplate.save();
    },
    copyTemplate(event, templateId) {
      return ChecklistTemplateModel.findById(templateId).then(
        checklistTemplate => {
          const copiedChecklist = _.omit(checklistTemplate, [
            '_id',
            'templateName',
          ]);

          event.checklists.push(copiedChecklist);

          return event.save().then(savedEvent => savedEvent.checklists);
        }
      );
    },
    readTemplate(templateId) {
      return ChecklistTemplateModel.findById(templateId);
    },
    listTemplates() {
      return ChecklistTemplateModel.find().select('_id templateName');
    },
  }),
});
export const ChecklistServiceToken = createToken<
  ServiceType<typeof ChecklistService>
>('ChecklistService');

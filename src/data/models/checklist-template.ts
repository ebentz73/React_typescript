import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export const ChecklistTemplateModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model(
      'ChecklistTemplate',
      new mongoose.Schema({
        templateName: String,
        name: String,
        checklistItems: [
          {
            id: String,
            text: String,
            checked: Boolean,
          },
        ],
      })
    ),
});
export const ChecklistTemplateModelToken = createToken<
  ServiceType<typeof ChecklistTemplateModel>
>('ChecklistTemplateModel');

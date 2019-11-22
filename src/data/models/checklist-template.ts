import mongoose, {Schema} from 'mongoose';

const ChecklistTemplateSchema = new Schema({
  templateName: String,
  name: String,
  checklistItems: [
    {
      id: String,
      text: String,
      checked: Boolean,
    },
  ],
});

export const ChecklistTemplate = mongoose.model(
  'ChecklistTemplate',
  ChecklistTemplateSchema
);

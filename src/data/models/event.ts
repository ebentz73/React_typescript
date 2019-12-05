import {Document} from 'mongoose';
import {UserDocument} from './user';
import {EVENT_STATUS} from '../../constants/model-constants';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';
import {ContactDocument} from './contact';

export interface ChecklistItem extends Document {
  text: string;
  checked: boolean;
}
/*
interface Checklist extends Document {
  name: string;
  checklistItems: ChecklistItem[];
}
*/

export interface Contract {
  eventId: number;
  url: string;
  details: ContractDetails[];
}

interface ContractDetails {
  fieldLabel: string;
  fieldInputKind: string;
}

export interface EventDocument extends Document {
  name: string;
  status: string;
  creator: UserDocument;
  budget: number;
  date: Date;
  clients: ContactDocument[];
}

export const EventModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model<EventDocument>(
      'Event',
      new mongoose.Schema(
        {
          name: String,
          status: {
            type: String,
            required: true,
            default: EVENT_STATUS.ACTIVE,
            enum: Object.values(EVENT_STATUS),
          },
          creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
          budget: Number,
          date: Date,
          clients: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Contact',
            },
          ],
        },
        {timestamps: true}
      )
    ),
});

export const EventModelToken = createToken<ServiceType<typeof EventModel>>(
  'EventModel'
);

import {Document} from 'mongoose';
import {UserDocument} from './user';
import {FIELD_INPUT_KIND} from '../../constants/field-input';
import {
  EVENT_STATUS,
  EVENT_TYPE,
  TIMEZONE,
  CURRENCY,
} from '../../constants/model-constants';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export interface ChecklistItem extends Document {
  text: string;
  checked: boolean;
}

interface Checklist extends Document {
  name: string;
  checklistItems: ChecklistItem[];
}

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
  creator: UserDocument;
  type: string;
  date: Date;
  client: string; // TODO when we have contact schema
  checklists: Checklist[];
  onsiteContact: string;
  status: string;
  timezone: string;
  currency: string;
  contacts: string[];
  budgetItems: string[];
  paymentSchedules: string[];
  timelineItems: string[];
  vendors: string[];
}

export const EventModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) =>
    mongoose.model<EventDocument>(
      'Event',
      new mongoose.Schema(
        {
          name: String,
          date: Date,
          client: {type: mongoose.Schema.Types.ObjectId, ref: 'Contact'},
          type: {
            type: String,
            default: EVENT_TYPE.DEFAULT,
            enum: Object.values(EVENT_TYPE),
          },
          checklists: [
            {
              name: String,
              checklistItems: [
                {
                  text: String,
                  checked: Boolean,
                },
              ],
            },
          ],
          creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
          status: {
            type: String,
            required: true,
            default: EVENT_STATUS.ACTIVE,
            enum: Object.values(EVENT_STATUS),
          },
          currency: {
            type: String,
            required: true,
            default: CURRENCY.DEFAULT,
            enum: Object.values(CURRENCY),
          },
          timezone: {
            type: String,
            required: true,
            default: TIMEZONE.DEFAULT,
            enum: Object.values(TIMEZONE),
          },
          vendors: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Vendor',
            },
          ],
          contacts: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Contact',
            },
          ],
          budgetItems: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'BudgetItem',
            },
          ],
          paymentSchedules: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'PaymentSchedule',
            },
          ],
          timelineItems: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'TimelineItem',
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

export function generateContractDetails(vendorKind: string): ContractDetails[] {
  const contractDetails = generateDefaultContractDetails();
  switch (vendorKind) {
    case 'Default': {
      return contractDetails;
    }
    case 'Venue': {
      return contractDetails.concat(generateVenueContractDetails());
    }
    case 'AV': {
      return contractDetails.concat(generateAVContractDetails());
    }
    case 'Florist': {
      return contractDetails;
    }
    case 'Photographer': {
      return contractDetails;
    }
  }
  throw new Error('Cannot find vendor kind ' + vendorKind);
}

// returns list of default ContractDetails. Intended as a helper for adding new contracts
function generateDefaultContractDetails(): ContractDetails[] {
  return [
    {
      fieldLabel: 'Primary Contact',
      fieldInputKind: FIELD_INPUT_KIND.CONTACT,
    },
    {
      fieldLabel: 'Onsite Contact',
      fieldInputKind: FIELD_INPUT_KIND.CONTACT,
    },
    {
      fieldLabel: 'Group Name',
      fieldInputKind: FIELD_INPUT_KIND.TEXT,
    },
    {
      fieldLabel: 'Group Contact',
      fieldInputKind: FIELD_INPUT_KIND.CONTACT,
    },
    {
      fieldLabel: 'Group Address',
      fieldInputKind: FIELD_INPUT_KIND.CONTACT,
    },
    {
      fieldLabel: 'Group Size',
      fieldInputKind: FIELD_INPUT_KIND.NUMBER,
    },
    {
      fieldLabel: 'Event Date',
      fieldInputKind: FIELD_INPUT_KIND.DATE,
    },
    {
      fieldLabel: 'Confirmation Number',
      fieldInputKind: FIELD_INPUT_KIND.TEXT,
    },
    {
      fieldLabel: 'Room Name',
      fieldInputKind: FIELD_INPUT_KIND.TEXT,
    },
    {
      fieldLabel: 'Event Start Time',
      fieldInputKind: FIELD_INPUT_KIND.TIME,
    },
    {
      fieldLabel: 'Event End Time',
      fieldInputKind: FIELD_INPUT_KIND.TIME,
    },
    {
      fieldLabel: 'Setup Start Time',
      fieldInputKind: FIELD_INPUT_KIND.TIME,
    },
    {
      fieldLabel: 'Teardown End Time',
      fieldInputKind: FIELD_INPUT_KIND.TIME,
    },
  ];
}

function generateVenueContractDetails(): ContractDetails[] {
  return [
    {
      fieldLabel: 'Parking Info',
      fieldInputKind: FIELD_INPUT_KIND.TEXTAREA,
    },
    {
      fieldLabel: 'Valet Info',
      fieldInputKind: FIELD_INPUT_KIND.TEXTAREA,
    },
    {
      fieldLabel: 'Group Size Due Date',
      fieldInputKind: FIELD_INPUT_KIND.DATE,
    },
  ];
}

function generateAVContractDetails(): ContractDetails[] {
  return [
    {
      fieldLabel: 'Technician Hours',
      fieldInputKind: FIELD_INPUT_KIND.NUMBER,
    },
    {
      fieldLabel: 'Security Requirements',
      fieldInputKind: FIELD_INPUT_KIND.TEXT,
    },
  ];
}

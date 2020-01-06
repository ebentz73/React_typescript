import {VendorKinds} from '../constants/vendor-kind';
import {VendorContactKind} from '../constants/vendor-contact-kind';

export interface SessionSchema {
  id: string;
  isLoggedIn: boolean;
  error?: string;
}

export interface EventSchema {
  id: string;
  date: number;
  name: string;
  budget: number;
  isArchived: boolean;
}

export interface ContactSchema {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface VendorContactSchema {
  contact: ContactSchema;
  contactKind: VendorContactKind;
}

export interface BudgetItemSchema {
  id: string;
  item: string;
  quantity: number;
  amount: number;
}

export interface RichTextSchema {
  id: string;
  data: string;
}

export interface CoreVendorSchema {
  id: string;
  name: string;
  vendorKind: VendorKinds;
  location: string;
  contacts: VendorContactSchema[];
  notesRichTextId: string | null;
}

export interface VendorSchema extends CoreVendorSchema {
  budgetItems: BudgetItemSchema[];
  paymentSchedule: PaymentScheduleSchema[];
  timelineItems: TimelineItemSchema[];
}

export interface PaymentScheduleSchema {
  id: string;
  item: string;
  description: string;
  dueDate: number;
  amount: number;
  isPaid: boolean;
}

export interface TimelineItemSchema {
  id: string;
  date: number;
  description: string;
}

export interface EventInput {
  name: string;
  date: number;
  budget: number;
  clients: ContactInput[];
}

export interface RichTextInput {
  id: string | null;
  eventId: string | null;
  data: string;
}

export interface VendorInput {
  eventId: string;
  name: string;
  vendorKind: VendorKinds;
  location: string;
  contact: ContactInput;
}

export interface ContactInput {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface VendorContactInput {
  contact: ContactInput;
  contactKind: VendorContactKind;
}

export interface BudgetItemInput {
  id: string | null;
  vendorId: string;
  item: string;
  quantity: number;
  amount: number;
}

export interface PaymentScheduleInput {
  id: string | null;
  vendorId: string;
  item: string;
  description: string;
  dueDate: number;
  amount: number;
  isPaid: boolean;
}

export interface TimelineItemInput {
  id: string | null;
  vendorId: string;
  date: number;
  description: string;
}

export enum EventFilterType {
  ALL = 'ALL',
  RECENT = 'RECENT',
  ARCHIVED = 'ARCHIVED',
}

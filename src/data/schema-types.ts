import {VendorKinds} from '../constants/vendor-kind';

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

export interface VendorSchema {
  id: string;
  name: string;
  vendorKind: VendorKinds;
  location: string;
  contact: ContactSchema;
}

export interface EventInput {
  name: string;
  date: number;
  budget: number;
  clients: ContactInput[];
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

export enum EventFilterType {
  ALL = 'ALL',
  RECENT = 'RECENT',
  ARCHIVED = 'ARCHIVED',
}

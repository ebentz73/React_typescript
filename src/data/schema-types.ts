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

export interface EventInput {
  name: string;
  date: number;
  budget: number;
  clients: ContactInput[];
}

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
}

export enum EventFilterType {
  ALL = 'ALL',
  RECENT = 'RECENT',
  ARCHIVED = 'ARCHIVED',
}

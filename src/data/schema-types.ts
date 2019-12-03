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

export enum EventFilterType {
  ALL = 'ALL',
  RECENT = 'RECENT',
  ARCHIVED = 'ARCHIVED',
}

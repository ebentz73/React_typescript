export const RoutePaths = {
  Login: () => '/login',
  Logout: () => '/logout',
  Events: () => '/',
  NewEvent: () => '/new-event',

  Event: (eventId = ':eventId') => `/event/${eventId}/`,
  EventBudget: (eventId = ':eventId') => `/event/${eventId}/budget`,
  EventChecklist: (eventId = ':eventId') => `/event/${eventId}/checklist`,
  EventDashboard: (eventId = ':eventId') => `/event/${eventId}/dashboard`,
  EventSettings: (eventId = ':eventId') => `/event/${eventId}/settings`,
  EventTimeline: (eventId = ':eventId') => `/event/${eventId}/timeline`,
  EventVendors: (eventId = ':eventId') => `/event/${eventId}/vendors`,
  NewVendor: (eventId = ':eventId') => `/event/${eventId}/new-vendor`,
};

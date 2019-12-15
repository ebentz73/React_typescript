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
  EventVendor: (eventId = ':eventId', vendorId = ':vendorId') =>
    `/event/${eventId}/vendor/${vendorId}`,
  NewVendor: (eventId = ':eventId') => `/event/${eventId}/new-vendor`,
  EditVendor: (eventId = ':eventId') => `/event/${eventId}/edit-vendor`,

  VendorContact: (eventId = ':eventId', vendorId = ':vendorId') =>
    `/event/${eventId}/vendor/${vendorId}/contact`,
  VendorBudgetItems: (eventId = ':eventId', vendorId = ':vendorId') =>
    `/event/${eventId}/vendor/${vendorId}/budget-items`,
  VendorPaymentSchedule: (eventId = ':eventId', vendorId = ':vendorId') =>
    `/event/${eventId}/vendor/${vendorId}/payment-schedule`,
  VendorTimelineItems: (eventId = ':eventId', vendorId = ':vendorId') =>
    `/event/${eventId}/vendor/${vendorId}/timeline-items`,
  VendorNotes: (eventId = ':eventId', vendorId = ':vendorId') =>
    `/event/${eventId}/vendor/${vendorId}/notes`,
};

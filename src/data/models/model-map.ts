import {BudgetItemModelToken} from './budget-item';
import {ContactModelToken} from './contact';
import {PaymentScheduleModelToken} from './payment-schedule';
import {TimelineItemModelToken} from './timeline-item';
import {createPlugin, createToken, ServiceType} from 'fusion-core';

export const ModelMap = createPlugin({
  deps: {
    BudgetItemModel: BudgetItemModelToken,
    ContactModel: ContactModelToken,
    PaymentScheduleModel: PaymentScheduleModelToken,
    TimelineItemModel: TimelineItemModelToken,
  },
  provides: ({
    BudgetItemModel,
    ContactModel,
    PaymentScheduleModel,
    TimelineItemModel,
  }) => ({
    budgetItem: BudgetItemModel,
    contact: ContactModel,
    paymentSchedule: PaymentScheduleModel,
    timelineItem: TimelineItemModel,
  }),
});
export const ModelMapToken = createToken<ServiceType<typeof ModelMap>>(
  'ModelMap'
);

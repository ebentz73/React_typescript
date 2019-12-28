import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {UserModelToken, UserDocument} from '../models/user';
import {SessionAuthToken} from '../../plugins/session-auth';
import {
  EventSchema,
  BudgetItemSchema,
  CoreVendorSchema,
  PaymentScheduleSchema,
  TimelineItemSchema,
} from '../schema-types';
import {unwrap} from '../../util';
import {VendorServiceToken} from '../services/vendor';
import {VendorDocument} from '../models/vendor';
import {BudgetItemDocument} from '../models/budget-item';
import {PaymentScheduleDocument} from '../models/payment-schedule';
import {TimelineItemDocument} from '../models/timeline-item';

export const VendorsResolvers = createPlugin({
  deps: {
    sessionAuth: SessionAuthToken,
    UserModel: UserModelToken,
    vendorService: VendorServiceToken,
  },
  provides: ({sessionAuth, UserModel, vendorService}) => {
    const getUserId = ctx => unwrap(sessionAuth.getUserId(ctx));
    const getUser = async ctx =>
      unwrap(await UserModel.findById(getUserId(ctx)).exec()) as UserDocument;

    const getVendorSchema = (
      vendorDocument: VendorDocument
    ): CoreVendorSchema => ({
      id: vendorDocument.id,
      name: vendorDocument.name,
      location: vendorDocument.location,
      vendorKind: vendorDocument.vendorKind,
      contacts: vendorDocument.contacts,
    });

    const getBudgetItemSchema = (
      budgetItem: BudgetItemDocument
    ): BudgetItemSchema => ({
      id: budgetItem.id,
      item: budgetItem.item,
      amount: budgetItem.amount,
      quantity: budgetItem.quantity,
    });

    const getPaymentScheduleSchema = (
      paymentSchedule: PaymentScheduleDocument
    ): PaymentScheduleSchema => ({
      id: paymentSchedule.id,
      item: paymentSchedule.item,
      description: paymentSchedule.description,
      dueDate: paymentSchedule.dueDate.valueOf(),
      amount: paymentSchedule.amount,
      isPaid: paymentSchedule.isPaid,
    });

    const getTimelineItemSchema = (
      timelineItem: TimelineItemDocument
    ): TimelineItemSchema => ({
      id: timelineItem.id,
      date: timelineItem.date.valueOf(),
      description: timelineItem.description,
    });

    return {
      Query: {
        vendor: async (_, {id}, ctx): Promise<CoreVendorSchema> => {
          return getVendorSchema(
            await vendorService.findById(id, (await getUser(ctx)).id)
          );
        },
      },
      Vendor: {
        budgetItems: async (
          vendor: CoreVendorSchema
        ): Promise<BudgetItemSchema[]> => {
          const budgetItems = await vendorService.findAllBudgetItemsByVendor(
            vendor.id
          );
          return budgetItems.map(getBudgetItemSchema);
        },
        paymentSchedule: async (
          vendor: CoreVendorSchema
        ): Promise<PaymentScheduleSchema[]> => {
          const paymentSchedule = await vendorService.findAllPaymentSchedulesByVendor(
            vendor.id
          );
          return paymentSchedule.map(getPaymentScheduleSchema);
        },
        timelineItems: async (
          vendor: CoreVendorSchema
        ): Promise<TimelineItemSchema[]> => {
          const timelineItems = await vendorService.findAllTimelineItemsByVendor(
            vendor.id
          );
          return timelineItems.map(getTimelineItemSchema);
        },
      },
      Event: {
        vendors: async (event: EventSchema): Promise<CoreVendorSchema[]> => {
          const vendors = await vendorService.findAllByEvent(event.id);
          return vendors.map(getVendorSchema);
        },
      },
      Mutation: {
        createVendor: async (_, {vendor}, ctx): Promise<CoreVendorSchema> => {
          const newVendor = await vendorService.create(
            vendor,
            await getUser(ctx)
          );
          return getVendorSchema(newVendor);
        },
        editVendor: async (_, {id, vendor}, ctx): Promise<CoreVendorSchema> => {
          const updatedVendor = await vendorService.update(
            id,
            vendor,
            await getUser(ctx)
          );
          return getVendorSchema(updatedVendor);
        },
        deleteVendor: async (_, {id}, ctx): Promise<string> => {
          await vendorService.delete(id, await getUser(ctx));
          return id;
        },
        upsertVendorContact: async (
          _,
          {vendorId, vendorContact},
          ctx
        ): Promise<CoreVendorSchema> => {
          const updatedVendor = await vendorService.upsertVendorContact(
            vendorId,
            vendorContact,
            await getUser(ctx)
          );
          return getVendorSchema(updatedVendor);
        },
        deleteVendorContact: async (
          _,
          {vendorId, contactId},
          ctx
        ): Promise<CoreVendorSchema> => {
          const updatedVendor = await vendorService.deleteVendorContact(
            vendorId,
            contactId,
            await getUser(ctx)
          );
          return getVendorSchema(updatedVendor);
        },
        upsertBudgetItem: async (
          _,
          {budgetItem},
          ctx
        ): Promise<CoreVendorSchema> => {
          const vendor = await vendorService.upsertBudgetItem(
            budgetItem,
            await getUser(ctx)
          );
          return getVendorSchema(vendor);
        },
        deleteBudgetItem: async (_, {id}, ctx): Promise<CoreVendorSchema> => {
          const vendor = await vendorService.deleteBudgetItem(
            id,
            await getUser(ctx)
          );
          return getVendorSchema(vendor);
        },
        upsertPaymentSchedule: async (
          _,
          {paymentSchedule},
          ctx
        ): Promise<CoreVendorSchema> => {
          const vendor = await vendorService.upsertPaymentSchedule(
            paymentSchedule,
            await getUser(ctx)
          );
          return getVendorSchema(vendor);
        },
        deletePaymentSchedule: async (
          _,
          {id},
          ctx
        ): Promise<CoreVendorSchema> => {
          const vendor = await vendorService.deletePaymentSchedule(
            id,
            await getUser(ctx)
          );
          return getVendorSchema(vendor);
        },
        upsertTimelineItem: async (
          _,
          {timelineItem},
          ctx
        ): Promise<CoreVendorSchema> => {
          const vendor = await vendorService.upsertTimelineItem(
            timelineItem,
            await getUser(ctx)
          );
          return getVendorSchema(vendor);
        },
        deleteTimelineItem: async (_, {id}, ctx): Promise<CoreVendorSchema> => {
          const vendor = await vendorService.deleteTimelineItem(
            id,
            await getUser(ctx)
          );
          return getVendorSchema(vendor);
        },
      },
    };
  },
});

export const VendorsResolversToken = createToken<
  ServiceType<typeof VendorsResolvers>
>('VendorsResolvers');

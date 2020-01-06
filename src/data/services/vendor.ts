import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {VendorModelToken, VendorDocument} from '../models/vendor';
import {ContactModelToken, ContactDocument} from '../models/contact';
import {
  VendorInput,
  VendorContactInput,
  BudgetItemInput,
  PaymentScheduleInput,
  TimelineItemInput,
} from '../schema-types';
import {UserDocument} from '../models/user';
import {EventServiceToken} from './event';
import {unwrap, forceCast, safeUnwrap} from '../../util';
import {VendorContactKind} from '../../constants/vendor-contact-kind';
import {BudgetItemModelToken, BudgetItemDocument} from '../models/budget-item';
import {
  PaymentScheduleDocument,
  PaymentScheduleModelToken,
} from '../models/payment-schedule';
import {
  TimelineItemDocument,
  TimelineItemModelToken,
} from '../models/timeline-item';

export const VendorService = createPlugin({
  deps: {
    VendorModel: VendorModelToken,
    ContactModel: ContactModelToken,
    EventService: EventServiceToken,
    BudgetItemModel: BudgetItemModelToken,
    PaymentScheduleModel: PaymentScheduleModelToken,
    TimelineItemModel: TimelineItemModelToken,
  },
  provides: ({
    VendorModel,
    ContactModel,
    EventService,
    BudgetItemModel,
    PaymentScheduleModel,
    TimelineItemModel,
  }) => {
    const findById = async (vendorId: string, userId: string) => {
      const vendor = unwrap(
        await VendorModel.findById(vendorId)
          .populate('contacts.contact')
          .exec()
      );
      await EventService.findById(vendor.event, userId);
      return vendor;
    };

    return {
      create: async (
        vendorInput: VendorInput,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const event = await EventService.findById(vendorInput.eventId, user.id);
        const contact = new ContactModel({
          name: unwrap(vendorInput.contact.name),
          email: unwrap(vendorInput.contact.email),
          phone: unwrap(vendorInput.contact.phone),
        });
        const vendor = new VendorModel({
          name: vendorInput.name,
          vendorKind: vendorInput.vendorKind,
          location: vendorInput.location,
          creator: user,
          contacts: [
            {
              contact,
              contactKind: VendorContactKind.Primary,
            },
          ],
          event,
        });

        await contact.save();
        await vendor.save();

        return vendor;
      },
      update: async (
        id: string,
        vendorInput: VendorInput,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const vendor = await findById(id, user.id);

        vendor.name = vendorInput.name;
        vendor.vendorKind = vendorInput.vendorKind;
        vendor.location = vendorInput.location;

        await vendor.save();
        return vendor;
      },
      updateVendorNote: async (
        id: string,
        notesRichTextId: string,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const vendor = await findById(id, user.id);

        vendor.notesRichText = notesRichTextId as any;

        await vendor.save();
        return vendor;
      },
      delete: async (id: string, user: UserDocument): Promise<string> => {
        const vendor = await findById(id, user.id);
        vendor.remove();
        await vendor.save();

        return id;
      },
      findById,
      findAllByEvent: async (eventId: string): Promise<VendorDocument[]> => {
        return (await VendorModel.find({
          event: eventId,
        })
          .populate('contacts.contact')
          .exec()) as VendorDocument[];
      },
      upsertVendorContact: async (
        vendorId: string,
        vendorContact: VendorContactInput,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const vendor = await findById(vendorId, user.id);
        const existingVendorContact = safeUnwrap(vendorContact.contact.id, id =>
          vendor.contacts.find(c => c.contact.id === id)
        );
        const newContact = forceCast<ContactDocument>(
          new ContactModel({
            name: unwrap(vendorContact.contact.name),
            email: unwrap(vendorContact.contact.email),
            phone: unwrap(vendorContact.contact.phone),
          })
        );
        if (existingVendorContact) {
          existingVendorContact.contact = newContact;
          existingVendorContact.contactKind = vendorContact.contactKind;
        } else {
          vendor.contacts.push({
            contact: newContact,
            contactKind: vendorContact.contactKind,
          });
        }

        await newContact.save();
        await vendor.save();
        return vendor;
      },
      deleteVendorContact: async (
        vendorId: string,
        contactId: string,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const vendor = await findById(vendorId, user.id);
        vendor.contacts = vendor.contacts.filter(
          c => c.contact.id !== contactId
        );
        await vendor.save();
        return vendor;
      },
      findAllBudgetItemsByVendor: async (
        vendorId: string
      ): Promise<BudgetItemDocument[]> => {
        return (await BudgetItemModel.find({
          vendor: vendorId,
        }).exec()) as BudgetItemDocument[];
      },
      upsertBudgetItem: async (
        budgetItem: BudgetItemInput,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const vendor = await findById(budgetItem.vendorId, user.id);

        let budgetItemDocument: BudgetItemDocument;
        if (budgetItem.id) {
          budgetItemDocument = unwrap(
            await BudgetItemModel.findById(budgetItem.id).exec()
          ) as BudgetItemDocument;
        } else {
          budgetItemDocument = new BudgetItemModel({}) as BudgetItemDocument;
        }

        budgetItemDocument.item = budgetItem.item;
        budgetItemDocument.quantity = budgetItem.quantity;
        budgetItemDocument.amount = budgetItem.amount;
        budgetItemDocument.vendor = budgetItem.vendorId as any;

        await budgetItemDocument.save();
        return vendor;
      },
      deleteBudgetItem: async (
        id: string,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const budgetItem = unwrap(
          await BudgetItemModel.findById(id).exec()
        ) as BudgetItemDocument;
        const vendor = await findById(budgetItem.vendor.toString(), user.id);
        await budgetItem.remove();

        return vendor;
      },
      findAllPaymentSchedulesByVendor: async (
        vendorId: string
      ): Promise<PaymentScheduleDocument[]> => {
        return (await PaymentScheduleModel.find({
          vendor: vendorId,
        }).exec()) as PaymentScheduleDocument[];
      },
      upsertPaymentSchedule: async (
        paymentSchedule: PaymentScheduleInput,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const vendor = await findById(paymentSchedule.vendorId, user.id);

        let paymentScheduleDocument: PaymentScheduleDocument;
        if (paymentSchedule.id) {
          paymentScheduleDocument = unwrap(
            await PaymentScheduleModel.findById(paymentSchedule.id).exec()
          ) as PaymentScheduleDocument;
        } else {
          paymentScheduleDocument = new PaymentScheduleModel(
            {}
          ) as PaymentScheduleDocument;
        }

        paymentScheduleDocument.item = paymentSchedule.item;
        paymentScheduleDocument.description = paymentSchedule.description;
        paymentScheduleDocument.dueDate = new Date(paymentSchedule.dueDate);
        paymentScheduleDocument.amount = paymentSchedule.amount;
        paymentScheduleDocument.isPaid = paymentSchedule.isPaid;
        paymentScheduleDocument.vendor = paymentSchedule.vendorId as any;

        await paymentScheduleDocument.save();
        return vendor;
      },
      deletePaymentSchedule: async (
        id: string,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const paymentSchedule = unwrap(
          await PaymentScheduleModel.findById(id).exec()
        ) as PaymentScheduleDocument;
        const vendor = await findById(
          paymentSchedule.vendor.toString(),
          user.id
        );
        await paymentSchedule.remove();

        return vendor;
      },
      findAllTimelineItemsByVendor: async (
        vendorId: string
      ): Promise<TimelineItemDocument[]> => {
        return (await TimelineItemModel.find({
          vendor: vendorId,
        }).exec()) as TimelineItemDocument[];
      },
      upsertTimelineItem: async (
        timelineItem: TimelineItemInput,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const vendor = await findById(timelineItem.vendorId, user.id);

        let timelineItemDocument: TimelineItemDocument;
        if (timelineItem.id) {
          timelineItemDocument = unwrap(
            await TimelineItemModel.findById(timelineItem.id).exec()
          ) as TimelineItemDocument;
        } else {
          timelineItemDocument = new TimelineItemModel(
            {}
          ) as TimelineItemDocument;
        }

        timelineItemDocument.date = new Date(timelineItem.date);
        timelineItemDocument.description = timelineItem.description;
        timelineItemDocument.vendor = timelineItem.vendorId as any;

        await timelineItemDocument.save();
        return vendor;
      },
      deleteTimelineItem: async (
        id: string,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const timelineItem = unwrap(
          await TimelineItemModel.findById(id).exec()
        ) as TimelineItemDocument;
        const vendor = await findById(timelineItem.vendor.toString(), user.id);
        await timelineItem.remove();

        return vendor;
      },
    };
  },
});
export const VendorServiceToken = createToken<
  ServiceType<typeof VendorService>
>('VendorService');

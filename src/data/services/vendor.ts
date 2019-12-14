import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {VendorModelToken, VendorDocument} from '../models/vendor';
import {ContactModelToken} from '../models/contact';
import {VendorInput} from '../schema-types';
import {UserDocument} from '../models/user';
import {EventServiceToken} from './event';
import {unwrap} from '../../util';

export const VendorService = createPlugin({
  deps: {
    VendorModel: VendorModelToken,
    ContactModel: ContactModelToken,
    EventService: EventServiceToken,
  },
  provides: ({VendorModel, ContactModel, EventService}) => {
    const findById = async (vendorId: string) => {
      return unwrap(
        await VendorModel.findById(vendorId)
          .populate('contact')
          .exec()
      );
    };

    return {
      create: async (
        vendorInput: VendorInput,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const event = await EventService.findById(vendorInput.eventId, user.id);
        const vendor = new VendorModel({
          name: vendorInput.name,
          vendorKind: vendorInput.vendorKind,
          location: vendorInput.location,
          creator: user,
          contact: new ContactModel({
            name: unwrap(vendorInput.contact.name),
            email: unwrap(vendorInput.contact.email),
            phone: unwrap(vendorInput.contact.phone),
          }),
          event,
        });

        await vendor.contact.save();
        await vendor.save();

        return vendor;
      },
      update: async (
        id: string,
        vendorInput: VendorInput,
        user: UserDocument
      ): Promise<VendorDocument> => {
        const vendor = await findById(id);
        await EventService.findById(vendor.event, user.id);

        vendor.name = vendorInput.name;
        vendor.vendorKind = vendorInput.vendorKind;
        vendor.location = vendorInput.location;
        if (!vendorInput.contact.id) {
          const contact = new ContactModel({
            name: unwrap(vendorInput.contact.name),
            email: unwrap(vendorInput.contact.email),
            phone: unwrap(vendorInput.contact.phone),
          });
          await contact.save();
          vendor.contact = contact as any;
        }

        await vendor.save();
        return vendor;
      },
      delete: async (id: string, user: UserDocument): Promise<string> => {
        const vendor = await findById(id);
        await EventService.findById(vendor.event, user.id);

        vendor.remove();
        await vendor.save();

        return id;
      },
      findAllByEvent: async (eventId: string): Promise<VendorDocument[]> => {
        return (await VendorModel.find({
          event: eventId,
        })
          .populate('contact')
          .exec()) as VendorDocument[];
      },
    };
  },
});
export const VendorServiceToken = createToken<
  ServiceType<typeof VendorService>
>('VendorService');

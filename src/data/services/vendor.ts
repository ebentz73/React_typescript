import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {VendorModelToken, VendorDocument} from '../models/vendor';
import {ContactModelToken} from '../models/contact';
import {VendorInput} from '../schema-types';
import {UserDocument} from '../models/user';
import {EventServiceToken} from './event';

export const VendorService = createPlugin({
  deps: {
    VendorModel: VendorModelToken,
    ContactModel: ContactModelToken,
    EventService: EventServiceToken,
  },
  provides: ({VendorModel, ContactModel, EventService}) => {
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
            name: vendorInput.contact.name,
            email: vendorInput.contact.email,
            phone: vendorInput.contact.phone,
          }),
          event,
        });

        await vendor.contact.save();
        await vendor.save();

        return vendor;
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

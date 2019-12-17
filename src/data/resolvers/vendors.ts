import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {UserModelToken, UserDocument} from '../models/user';
import {SessionAuthToken} from '../../plugins/session-auth';
import {VendorSchema, EventSchema} from '../schema-types';
import {unwrap} from '../../util';
import {VendorServiceToken} from '../services/vendor';
import {VendorDocument} from '../models/vendor';

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

    const getVendorSchema = (vendorDocument: VendorDocument): VendorSchema => ({
      id: vendorDocument.id,
      name: vendorDocument.name,
      location: vendorDocument.location,
      vendorKind: vendorDocument.vendorKind,
      contact: vendorDocument.contact,
    });

    return {
      Query: {
        vendor: async (_, {id}, ctx): Promise<VendorSchema> => {
          return getVendorSchema(
            await vendorService.findById(id, await getUser(ctx))
          );
        },
      },
      Event: {
        vendors: async (event: EventSchema): Promise<VendorSchema[]> => {
          const vendors = await vendorService.findAllByEvent(event.id);
          return vendors.map(getVendorSchema);
        },
      },
      Mutation: {
        createVendor: async (_, {vendor}, ctx): Promise<VendorSchema> => {
          const newVendor = await vendorService.create(
            vendor,
            await getUser(ctx)
          );
          return getVendorSchema(newVendor);
        },
        editVendor: async (_, {id, vendor}, ctx): Promise<VendorSchema> => {
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
      },
    };
  },
});

export const VendorsResolversToken = createToken<
  ServiceType<typeof VendorsResolvers>
>('VendorsResolvers');
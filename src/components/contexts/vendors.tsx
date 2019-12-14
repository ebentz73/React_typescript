import React, {createContext, useContext} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {VendorSchema, VendorInput} from '../../data/schema-types';
import {EventContext} from '../event/context';
import {VendorsQueryType, VendorsQuery} from '../queries';
import {CreateVendorMutation} from '../mutations';
import {unwrap} from '../../util';
import {LoadingSpinner} from '../util';

interface ContextType {
  state: {
    vendors: VendorSchema[];
    createVendorLoading: boolean;
  };
  actions: {
    createVendor: (vendor: VendorInput) => Promise<void>;
  };
}

export const VendorsContext = createContext<ContextType>({} as any);

export const VendorsContextProvider = ({children}) => {
  const {event} = useContext(EventContext);
  const queryVariables = {
    variables: {eventId: event.id},
  };
  const {data, loading} = useQuery<VendorsQueryType>(
    VendorsQuery,
    queryVariables
  );

  const [createVendor, {loading: createVendorLoading}] = useMutation(
    CreateVendorMutation,
    {
      update: (store, {data: {createVendor}}) => {
        const data: VendorsQueryType = unwrap(
          store.readQuery({query: VendorsQuery, ...queryVariables})
        );
        data.event.vendors = [...data.event.vendors, createVendor];
        store.writeQuery({query: VendorsQuery, ...queryVariables, data});
      },
    }
  );

  if (loading || !data) {
    return <LoadingSpinner />;
  }

  const service: ContextType = {
    state: {
      vendors: data.event.vendors,
      createVendorLoading,
    },
    actions: {
      createVendor: async vendor => {
        await createVendor({variables: {vendor}});
      },
    },
  };
  return (
    <VendorsContext.Provider value={service}>
      {children}
    </VendorsContext.Provider>
  );
};

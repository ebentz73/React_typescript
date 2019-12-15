import React, {createContext, useContext, useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {VendorSchema, VendorInput} from '../../data/schema-types';
import {EventContext} from '../event/context';
import {VendorsQueryType, VendorsQuery} from '../queries';
import {
  CreateVendorMutation,
  EditVendorMutation,
  DeleteVendorMutation,
} from '../mutations';
import {unwrap} from '../../util';
import {LoadingSpinner} from '../util';

interface ContextType {
  state: {
    vendors: VendorSchema[];
    loading: boolean;
    editingVendor: VendorSchema | null;
  };
  actions: {
    createVendor: (vendor: VendorInput) => Promise<void>;
    setEditingVendor: (vendor: VendorSchema) => void;
    editVendor: (id: string, vendor: VendorInput) => Promise<void>;
    deleteVendor: (id: string) => Promise<void>;
  };
}

interface EditingVendorContextType {
  editingVendor: VendorSchema | null;
  setEditingVendor: (vendor: VendorSchema | null) => void;
}

export const VendorsContext = createContext<ContextType>({} as any);
export const EditingVendorContext = createContext<EditingVendorContextType>(
  {} as any
);

export const EditingVendorContextProvider = ({children}) => {
  const [editingVendor, setEditingVendor] = useState<VendorSchema | null>(null);
  const service: EditingVendorContextType = {editingVendor, setEditingVendor};

  return (
    <EditingVendorContext.Provider value={service}>
      {children}
    </EditingVendorContext.Provider>
  );
};

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
  const [editVendor, {loading: editVendorLoading}] = useMutation(
    EditVendorMutation
  );
  const [deleteVendor, {loading: deleteVendorLoading}] = useMutation(
    DeleteVendorMutation,
    {
      update: (store, {data: {deleteVendor}}) => {
        const data: VendorsQueryType = unwrap(
          store.readQuery({query: VendorsQuery, ...queryVariables})
        );
        data.event.vendors = data.event.vendors.filter(
          v => v.id !== deleteVendor
        );
        store.writeQuery({query: VendorsQuery, ...queryVariables, data});
      },
    }
  );

  const [editingVendor, setEditingVendor] = useState<VendorSchema | null>(null);

  if (loading || !data) {
    return <LoadingSpinner />;
  }

  const service: ContextType = {
    state: {
      vendors: data.event.vendors,
      loading: createVendorLoading || editVendorLoading || deleteVendorLoading,
      editingVendor,
    },
    actions: {
      createVendor: async vendor => {
        await createVendor({variables: {vendor}});
      },
      setEditingVendor,
      editVendor: async (id, vendor) => {
        await editVendor({variables: {id, vendor}});
      },
      deleteVendor: async id => {
        await deleteVendor({variables: {id}});
      },
    },
  };
  return (
    <VendorsContext.Provider value={service}>
      {children}
    </VendorsContext.Provider>
  );
};

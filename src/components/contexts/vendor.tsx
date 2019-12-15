import React, {createContext, ReactNode} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {VendorSchema} from '../../data/schema-types';
import {VendorQueryType, VendorQuery} from '../queries';
import {LoadingSpinner} from '../util';

interface ContextType {
  state: {
    vendor: VendorSchema;
  };
  actions: {};
}

export const VendorContext = createContext<ContextType>({} as any);

export const VendorContextProvider = ({
  children,
  vendorId,
}: {
  children: ReactNode;
  vendorId: string;
}) => {
  const {data, loading} = useQuery<VendorQueryType>(VendorQuery, {
    variables: {id: vendorId},
  });

  if (loading || !data) {
    return <LoadingSpinner />;
  }

  const service: ContextType = {
    state: {
      vendor: data.vendor,
    },
    actions: {},
  };
  return (
    <VendorContext.Provider value={service}>{children}</VendorContext.Provider>
  );
};

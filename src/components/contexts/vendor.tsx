import React, {createContext, ReactNode} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  VendorSchema,
  VendorContactInput,
  BudgetItemInput,
  PaymentScheduleInput,
  TimelineItemInput,
} from '../../data/schema-types';
import {VendorQueryType, VendorQuery} from '../queries';
import {LoadingSpinner} from '../util';
import {
  UpsertVendorContactMutation,
  DeleteVendorContactMutation,
  UpsertBudgetItemMutation,
  DeleteBudgetItemMutation,
  UpsertPaymentScheduleMutation,
  DeletePaymentScheduleMutation,
  UpsertTimelineItemMutation,
  DeleteTimelineItemMutation,
  UpdateVendorNoteMutation,
} from '../mutations';

interface ContextType {
  state: {
    vendor: VendorSchema;
  };
  actions: {
    upsertContact: (
      vendorId: string,
      vendorContact: VendorContactInput
    ) => Promise<void>;
    deleteContact: (vendorId: string, contactId: string) => Promise<void>;
    upsertBudgetItem: (budgetItem: BudgetItemInput) => Promise<void>;
    deleteBudgetItem: (id: string) => Promise<void>;
    upsertPaymentSchedule: (
      paymentSchedule: PaymentScheduleInput
    ) => Promise<void>;
    deletePaymentSchedule: (id: string) => Promise<void>;
    upsertTimelineItem: (timelineItem: TimelineItemInput) => Promise<void>;
    deleteTimelineItem: (id: string) => Promise<void>;
    updateNote: (id: string, notesRichTextId: string) => Promise<void>;
  };
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
  const [upsertVendorContact] = useMutation(UpsertVendorContactMutation);
  const [deleteVendorContact] = useMutation(DeleteVendorContactMutation);
  const [upsertBudgetItem] = useMutation(UpsertBudgetItemMutation);
  const [deleteBudgetItem] = useMutation(DeleteBudgetItemMutation);
  const [upsertPaymentSchedule] = useMutation(UpsertPaymentScheduleMutation);
  const [deletePaymentSchedule] = useMutation(DeletePaymentScheduleMutation);
  const [upsertTimelineItem] = useMutation(UpsertTimelineItemMutation);
  const [deleteTimelineItem] = useMutation(DeleteTimelineItemMutation);
  const [updateVendorNote] = useMutation(UpdateVendorNoteMutation);

  if (loading || !data) {
    return <LoadingSpinner />;
  }

  const service: ContextType = {
    state: {
      vendor: data.vendor,
    },
    actions: {
      upsertContact: async (vendorId, vendorContact) => {
        await upsertVendorContact({
          variables: {
            vendorId,
            vendorContact,
          },
        });
      },
      deleteContact: async (vendorId, contactId) => {
        await deleteVendorContact({variables: {vendorId, contactId}});
      },
      upsertBudgetItem: async budgetItem => {
        await upsertBudgetItem({variables: {budgetItem}});
      },
      deleteBudgetItem: async id => {
        await deleteBudgetItem({variables: {id}});
      },
      upsertPaymentSchedule: async paymentSchedule => {
        await upsertPaymentSchedule({variables: {paymentSchedule}});
      },
      deletePaymentSchedule: async id => {
        await deletePaymentSchedule({variables: {id}});
      },
      upsertTimelineItem: async timelineItem => {
        await upsertTimelineItem({variables: {timelineItem}});
      },
      deleteTimelineItem: async id => {
        await deleteTimelineItem({variables: {id}});
      },
      updateNote: async (id, notesRichTextId) => {
        await updateVendorNote({variables: {id, notesRichTextId}});
      },
    },
  };
  return (
    <VendorContext.Provider value={service}>{children}</VendorContext.Provider>
  );
};

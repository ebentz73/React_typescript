import {gql} from 'fusion-plugin-apollo';
import {RichTextSchema} from '../data/schema-types';

export const SignupUserMutation = gql('../data/mutations/signup.graphql');
export const LoginUserMutation = gql('../data/mutations/login.graphql');
export const LogOutMutation = gql('../data/mutations/logout.graphql');
export const ArchiveEventMutation = gql(
  '../data/mutations/archiveEvent.graphql'
);
export const CreateEventMutation = gql('../data/mutations/createEvent.graphql');
export const CreateVendorMutation = gql(
  '../data/mutations/createVendor.graphql'
);
export const EditVendorMutation = gql('../data/mutations/editVendor.graphql');
export const DeleteVendorMutation = gql(
  '../data/mutations/deleteVendor.graphql'
);
export const UpsertVendorContactMutation = gql(
  '../data/mutations/upsertVendorContact.graphql'
);
export const DeleteVendorContactMutation = gql(
  '../data/mutations/deleteVendorContact.graphql'
);

export const UpsertBudgetItemMutation = gql(
  '../data/mutations/upsertBudgetItem.graphql'
);
export const DeleteBudgetItemMutation = gql(
  '../data/mutations/deleteBudgetItem.graphql'
);

export const UpsertPaymentScheduleMutation = gql(
  '../data/mutations/upsertPaymentSchedule.graphql'
);
export const DeletePaymentScheduleMutation = gql(
  '../data/mutations/deletePaymentSchedule.graphql'
);

export const UpsertTimelineItemMutation = gql(
  '../data/mutations/upsertTimelineItem.graphql'
);
export const DeleteTimelineItemMutation = gql(
  '../data/mutations/deleteTimelineItem.graphql'
);

export const UpsertRichTextMutation = gql(
  '../data/mutations/upsertRichText.graphql'
);

export const UpdateVendorNoteMutation = gql(
  '../data/mutations/updateVendorNote.graphql'
);

export interface UpsertRichTextMutationType {
  upsertRichText: RichTextSchema;
}

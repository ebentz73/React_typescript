import {gql} from 'fusion-plugin-apollo';

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

import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
export type UserFieldsFragment = (
  { readonly __typename: 'User' }
  & Pick<Types.User, 'id' | 'name' | 'email' | 'cpf' | 'phone' | 'level' | 'hasActive' | 'createdAt' | 'updatedAt'>
);

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  id
  name
  email
  cpf
  phone
  level
  hasActive
  createdAt
  updatedAt
}
    `;
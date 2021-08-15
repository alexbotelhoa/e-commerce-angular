import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type UpdateUserMutationVariables = Types.Exact<{
  data: Types.UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly updateUser: (
    { readonly __typename: 'User' }
    & Pick<Types.User, 'id' | 'name' | 'email' | 'cpf' | 'phone' | 'level' | 'hasActive'>
  ) }
);

export const UpdateUserDocument = gql`
    mutation UpdateUser($data: UpdateUserInput!) {
  updateUser(data: $data) {
    ... on User {
      id
      name
      email
      cpf
      phone
      level
      hasActive
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserGQL extends Apollo.Mutation<UpdateUserMutation, UpdateUserMutationVariables> {
    document = UpdateUserDocument;
    
  }
import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type CreateUserMutationVariables = Types.Exact<{
  data: Types.CreateUserInput;
}>;


export type CreateUserMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly createUser: (
    { readonly __typename: 'User' }
    & Pick<Types.User, 'id' | 'name' | 'email'>
  ) }
);

export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data) {
    id
    name
    email
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateUserGQL extends Apollo.Mutation<CreateUserMutation, CreateUserMutationVariables> {
    document = CreateUserDocument;
    
  }
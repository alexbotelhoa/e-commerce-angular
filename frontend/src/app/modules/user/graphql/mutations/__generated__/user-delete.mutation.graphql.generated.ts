import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type DeleteUserMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteUserMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Types.Mutation, 'deleteUser'>
);

export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteUserGQL extends Apollo.Mutation<DeleteUserMutation, DeleteUserMutationVariables> {
    document = DeleteUserDocument;
    
  }
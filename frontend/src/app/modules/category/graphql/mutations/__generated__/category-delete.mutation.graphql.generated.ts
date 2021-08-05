import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type DeleteCategoryMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteCategoryMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Types.Mutation, 'deleteCategory'>
);

export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteCategoryGQL extends Apollo.Mutation<DeleteCategoryMutation, DeleteCategoryMutationVariables> {
    document = DeleteCategoryDocument;
    
  }
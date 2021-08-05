import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type DeleteProductMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteProductMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Types.Mutation, 'deleteProduct'>
);

export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteProductGQL extends Apollo.Mutation<DeleteProductMutation, DeleteProductMutationVariables> {
    document = DeleteProductDocument;
    
  }
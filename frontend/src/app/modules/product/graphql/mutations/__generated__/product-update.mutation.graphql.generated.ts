import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type UpdateProductMutationVariables = Types.Exact<{
  data: Types.UpdateProductInput;
}>;


export type UpdateProductMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly updateProduct: (
    { readonly __typename: 'Product' }
    & Pick<Types.Product, 'id' | 'name' | 'price' | 'categoryId'>
  ) }
);

export const UpdateProductDocument = gql`
    mutation UpdateProduct($data: UpdateProductInput!) {
  updateProduct(data: $data) {
    ... on Product {
      id
      name
      price
      categoryId
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateProductGQL extends Apollo.Mutation<UpdateProductMutation, UpdateProductMutationVariables> {
    document = UpdateProductDocument;
    
  }
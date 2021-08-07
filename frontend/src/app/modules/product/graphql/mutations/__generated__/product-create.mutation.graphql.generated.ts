import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type CreateProductMutationVariables = Types.Exact<{
  data: Types.CreateProductInput;
}>;


export type CreateProductMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly createProduct: (
    { readonly __typename: 'Product' }
    & Pick<Types.Product, 'id' | 'name' | 'price' | 'categoryId'>
  ) }
);

export const CreateProductDocument = gql`
    mutation CreateProduct($data: CreateProductInput!) {
  createProduct(data: $data) {
    id
    name
    price
    categoryId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateProductGQL extends Apollo.Mutation<CreateProductMutation, CreateProductMutationVariables> {
    document = CreateProductDocument;
    
  }
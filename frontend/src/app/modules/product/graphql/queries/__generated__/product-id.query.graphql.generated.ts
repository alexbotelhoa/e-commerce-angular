import * as Types from '../../../../../shared/graphql/generated/types';

import { ProductFieldsFragment } from '../../fragments/__generated__/product.fragment.graphql.generated';
import gql from 'graphql-tag';
import { ProductFieldsFragmentDoc } from '../../fragments/__generated__/product.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ProductIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ProductIdQuery = (
  { readonly __typename: 'Query' }
  & { readonly productId: Types.Maybe<(
    { readonly __typename: 'Product' }
    & ProductFieldsFragment
  )> }
);

export const ProductIdDocument = gql`
    query ProductId($id: ID!) {
  productId(id: $id) {
    ...ProductFields
  }
}
    ${ProductFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ProductIdGQL extends Apollo.Query<ProductIdQuery, ProductIdQueryVariables> {
    document = ProductIdDocument;
    
  }
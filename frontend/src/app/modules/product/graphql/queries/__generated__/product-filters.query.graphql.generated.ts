import * as Types from '../../../../../shared/graphql/generated/types';

import { ProductFieldsFragment } from '../../fragments/__generated__/product.fragment.graphql.generated';
import gql from 'graphql-tag';
import { ProductFieldsFragmentDoc } from '../../fragments/__generated__/product.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ProductByFieldQueryVariables = Types.Exact<{
  filter: Types.productQueryInput;
}>;


export type ProductByFieldQuery = (
  { readonly __typename: 'Query' }
  & { readonly productByField: ReadonlyArray<(
    { readonly __typename: 'Product' }
    & ProductFieldsFragment
  )> }
);

export const ProductByFieldDocument = gql`
    query ProductByField($filter: productQueryInput!) {
  productByField(fields: $filter) {
    ...ProductFields
  }
}
    ${ProductFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ProductByFieldGQL extends Apollo.Query<ProductByFieldQuery, ProductByFieldQueryVariables> {
    document = ProductByFieldDocument;
    
  }
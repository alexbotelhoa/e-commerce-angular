import * as Types from '../../../../../shared/graphql/generated/types';

import { ProductFieldsFragment } from '../../fragments/__generated__/product.fragment.graphql.generated';
import gql from 'graphql-tag';
import { ProductFieldsFragmentDoc } from '../../fragments/__generated__/product.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ProductAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProductAllQuery = (
  { readonly __typename: 'Query' }
  & { readonly productAll: ReadonlyArray<(
    { readonly __typename: 'Product' }
    & ProductFieldsFragment
  )> }
);

export const ProductAllDocument = gql`
    query ProductAll {
  productAll {
    ...ProductFields
  }
}
    ${ProductFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ProductAllGQL extends Apollo.Query<ProductAllQuery, ProductAllQueryVariables> {
    document = ProductAllDocument;
    
  }
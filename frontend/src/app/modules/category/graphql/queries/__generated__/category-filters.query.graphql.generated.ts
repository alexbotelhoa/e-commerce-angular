import * as Types from '../../../../../shared/graphql/generated/types';

import { CategoryFieldsFragment } from '../../fragments/__generated__/category.fragment.graphql.generated';
import gql from 'graphql-tag';
import { CategoryFieldsFragmentDoc } from '../../fragments/__generated__/category.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type CategoryByFieldQueryVariables = Types.Exact<{
  filter: Types.categoryQueryInput;
}>;


export type CategoryByFieldQuery = (
  { readonly __typename: 'Query' }
  & { readonly categoryByField: Types.Maybe<(
    { readonly __typename: 'Category' }
    & CategoryFieldsFragment
  )> }
);

export const CategoryByFieldDocument = gql`
    query CategoryByField($filter: categoryQueryInput!) {
  categoryByField(fields: $filter) {
    ...CategoryFields
  }
}
    ${CategoryFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CategoryByFieldGQL extends Apollo.Query<CategoryByFieldQuery, CategoryByFieldQueryVariables> {
    document = CategoryByFieldDocument;
    
  }
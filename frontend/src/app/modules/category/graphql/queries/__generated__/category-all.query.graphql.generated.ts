import * as Types from '../../../../../shared/graphql/generated/types';

import { CategoryFieldsFragment } from '../../fragments/__generated__/category.fragment.graphql.generated';
import gql from 'graphql-tag';
import { CategoryFieldsFragmentDoc } from '../../fragments/__generated__/category.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type CategoryAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CategoryAllQuery = (
  { readonly __typename: 'Query' }
  & { readonly categoryAll: ReadonlyArray<(
    { readonly __typename: 'Category' }
    & CategoryFieldsFragment
  )> }
);

export const CategoryAllDocument = gql`
    query CategoryAll {
  categoryAll {
    ...CategoryFields
  }
}
    ${CategoryFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CategoryAllGQL extends Apollo.Query<CategoryAllQuery, CategoryAllQueryVariables> {
    document = CategoryAllDocument;
    
  }
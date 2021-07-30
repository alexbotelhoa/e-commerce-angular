import * as Types from '../../../../../shared/graphql/generated/types';

import { CategoryFieldsFragment } from '../../fragments/__generated__/category.fragment.graphql.generated';
import gql from 'graphql-tag';
import { CategoryFieldsFragmentDoc } from '../../fragments/__generated__/category.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type CategoryIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CategoryIdQuery = (
  { readonly __typename: 'Query' }
  & { readonly categoryId: Types.Maybe<(
    { readonly __typename: 'Category' }
    & CategoryFieldsFragment
  )> }
);

export const CategoryIdDocument = gql`
    query CategoryId($id: ID!) {
  categoryId(id: $id) {
    ...CategoryFields
  }
}
    ${CategoryFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CategoryIdGQL extends Apollo.Query<CategoryIdQuery, CategoryIdQueryVariables> {
    document = CategoryIdDocument;
    
  }
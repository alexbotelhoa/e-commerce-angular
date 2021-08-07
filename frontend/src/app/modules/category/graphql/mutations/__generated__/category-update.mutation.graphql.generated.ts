import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type UpdateCategoryMutationVariables = Types.Exact<{
  data: Types.UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly updateCategory: (
    { readonly __typename: 'Category' }
    & Pick<Types.Category, 'id' | 'name'>
  ) }
);

export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($data: UpdateCategoryInput!) {
  updateCategory(data: $data) {
    ... on Category {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCategoryGQL extends Apollo.Mutation<UpdateCategoryMutation, UpdateCategoryMutationVariables> {
    document = UpdateCategoryDocument;
    
  }
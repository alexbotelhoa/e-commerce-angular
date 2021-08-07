import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type CreateCategoryMutationVariables = Types.Exact<{
  data: Types.CreateCategoryInput;
}>;


export type CreateCategoryMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly createCategory: (
    { readonly __typename: 'Category' }
    & Pick<Types.Category, 'id' | 'name'>
  ) }
);

export const CreateCategoryDocument = gql`
    mutation CreateCategory($data: CreateCategoryInput!) {
  createCategory(data: $data) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCategoryGQL extends Apollo.Mutation<CreateCategoryMutation, CreateCategoryMutationVariables> {
    document = CreateCategoryDocument;
    
  }
import * as Types from '../../../../../shared/graphql/generated/types';

import { UserFieldsFragment } from '../../fragments/__generated__/user.fragment.graphql.generated';
import gql from 'graphql-tag';
import { UserFieldsFragmentDoc } from '../../fragments/__generated__/user.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type UserAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserAllQuery = (
  { readonly __typename: 'Query' }
  & { readonly userAll: ReadonlyArray<(
    { readonly __typename: 'User' }
    & UserFieldsFragment
  )> }
);

export const UserAllDocument = gql`
    query UserAll {
  userAll {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UserAllGQL extends Apollo.Query<UserAllQuery, UserAllQueryVariables> {
    document = UserAllDocument;
    
  }
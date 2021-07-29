import * as Types from '../../generated/types';

import { UserFieldsFragment } from '../../fragments/__generated__/user.fragment.graphql.generated';
import gql from 'graphql-tag';
import { UserFieldsFragmentDoc } from '../../fragments/__generated__/user.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type UserQueryVariables = Types.Exact<{
  filter: Types.userQueryInput;
}>;


export type UserQuery = (
  { readonly __typename: 'Query' }
  & { readonly user: Types.Maybe<(
    { readonly __typename: 'User' }
    & UserFieldsFragment
  )> }
);

export const UserDocument = gql`
    query User($filter: userQueryInput!) {
  user(filters: $filter) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UserGQL extends Apollo.Query<UserQuery, UserQueryVariables> {
    document = UserDocument;
    
  }
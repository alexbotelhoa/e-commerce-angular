import * as Types from '../../../../../shared/graphql/generated/types';

import { UserFieldsFragment } from '../../fragments/__generated__/user.fragment.graphql.generated';
import gql from 'graphql-tag';
import { UserFieldsFragmentDoc } from '../../fragments/__generated__/user.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type UserByFieldQueryVariables = Types.Exact<{
  filter: Types.userQueryInput;
}>;


export type UserByFieldQuery = (
  { readonly __typename: 'Query' }
  & { readonly userByField: Types.Maybe<(
    { readonly __typename: 'User' }
    & UserFieldsFragment
  )> }
);

export const UserByFieldDocument = gql`
    query UserByField($filter: userQueryInput!) {
  userByField(fields: $filter) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UserByFieldGQL extends Apollo.Query<UserByFieldQuery, UserByFieldQueryVariables> {
    document = UserByFieldDocument;
    
  }
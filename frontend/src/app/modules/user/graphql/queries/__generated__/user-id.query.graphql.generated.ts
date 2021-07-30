import * as Types from '../../../../../shared/graphql/generated/types';

import { UserFieldsFragment } from '../../fragments/__generated__/user.fragment.graphql.generated';
import gql from 'graphql-tag';
import { UserFieldsFragmentDoc } from '../../fragments/__generated__/user.fragment.graphql.generated';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type UserIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type UserIdQuery = (
  { readonly __typename: 'Query' }
  & { readonly userId: Types.Maybe<(
    { readonly __typename: 'User' }
    & UserFieldsFragment
  )> }
);

export const UserIdDocument = gql`
    query UserId($id: ID!) {
  userId(id: $id) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UserIdGQL extends Apollo.Query<UserIdQuery, UserIdQueryVariables> {
    document = UserIdDocument;
    
  }
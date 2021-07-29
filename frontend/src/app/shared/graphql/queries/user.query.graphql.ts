import gql from 'graphql-tag';
import { UserFieldsFragment } from '../fragments/user.fragment.graphql';

export const UserQuery = gql`
  ${UserFieldsFragment}

  query User($filter: userQueryInput!) {
    user(filters: $filter) {
      ...UserFields
    }
  }
`;

import gql from 'graphql-tag';
import { UserFieldsFragment } from '../fragments/user.fragment.graphql';

export const UserFiltersQuery = gql`
  ${UserFieldsFragment}

  query UserByField($filter: userQueryInput!) {
    userByField(fields: $filter) {
      ...UserFields
    }
  }
`;

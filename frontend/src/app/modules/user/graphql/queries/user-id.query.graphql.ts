import gql from 'graphql-tag';
import { UserFieldsFragment } from '../fragments/user.fragment.graphql';

export const UserIdQuery = gql`
  ${UserFieldsFragment}

  query UserId ($id: ID!) {
    userId (id: $id) {
      ...UserFields
    }
  }
`;

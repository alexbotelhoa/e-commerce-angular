import gql from 'graphql-tag';
import { UserFieldsFragment } from '../fragments/user.fragment.graphql';

export const UpdateUserMutation = gql`
  ${UserFieldsFragment}

  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      ... on User {
        id
        name
        email
        cpf
        phone
        level
        hasActive
      }
    }
  }
`;

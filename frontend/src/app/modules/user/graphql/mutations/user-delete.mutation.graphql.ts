import gql from 'graphql-tag';
import { UserFieldsFragment } from '../fragments/user.fragment.graphql';

export const DeleteUserMutation = gql`
  ${UserFieldsFragment}

  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

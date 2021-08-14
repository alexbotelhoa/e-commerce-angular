import gql from 'graphql-tag';
import { UserFieldsFragment } from '../fragments/user.fragment.graphql';

export const CreateUserMutation = gql`
  ${UserFieldsFragment}

  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      name
      email
      cpf
      phone
    }
  }
`;

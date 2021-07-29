import gql from 'graphql-tag';

export const UserFieldsFragment = gql`
  fragment UserFields on User {
    id
    name
    email
    createdAt
    updatedAt
  }
`;

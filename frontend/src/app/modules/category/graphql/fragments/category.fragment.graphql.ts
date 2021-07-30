import gql from 'graphql-tag';

export const CategoryFieldsFragment = gql`
  fragment CategoryFields on Category {
    id
    name
    createdAt
    updatedAt
  }
`;

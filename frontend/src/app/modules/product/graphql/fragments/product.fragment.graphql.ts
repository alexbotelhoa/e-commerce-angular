import gql from 'graphql-tag';

export const ProductFieldsFragment = gql`
  fragment ProductFields on Product {
    id
    name
    price
    categoryId
    createdAt
    updatedAt
  }
`;

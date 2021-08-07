import gql from 'graphql-tag';
import { CategoryFieldsFragment } from './../../../category/graphql/fragments/category.fragment.graphql';

export const ProductFieldsFragment = gql`
  ${CategoryFieldsFragment}
  fragment ProductFields on Product {
    id
    name
    price
    categoryId
    category {
      ...CategoryFields
    }
    createdAt
    updatedAt
  }
`;

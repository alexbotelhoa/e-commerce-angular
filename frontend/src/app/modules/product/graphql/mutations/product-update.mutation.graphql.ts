import gql from 'graphql-tag';
import { ProductFieldsFragment } from '../fragments/product.fragment.graphql';

export const UpdateProductMutation = gql`
  ${ProductFieldsFragment}

  mutation UpdateProduct($data: UpdateProductInput!) {
    updateProduct(data: $data) {
      ... on Product {
        id
        name
        price
        categoryId
      }
    }
  }
`;

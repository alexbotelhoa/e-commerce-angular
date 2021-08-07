import gql from 'graphql-tag';
import { ProductFieldsFragment } from '../fragments/product.fragment.graphql';

export const CreateProductMutation = gql`
  ${ProductFieldsFragment}

  mutation CreateProduct($data: CreateProductInput!) {
    createProduct(data: $data) {
      id
      name
      price
      categoryId
    }
  }
`;

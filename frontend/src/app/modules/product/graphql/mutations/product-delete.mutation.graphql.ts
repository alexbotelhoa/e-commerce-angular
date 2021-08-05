import gql from 'graphql-tag';
import { ProductFieldsFragment } from '../fragments/product.fragment.graphql';

export const DeleteProductMutation = gql`
  ${ProductFieldsFragment}

  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

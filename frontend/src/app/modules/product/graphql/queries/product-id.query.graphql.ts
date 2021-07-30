import gql from 'graphql-tag';
import { ProductFieldsFragment } from '../fragments/product.fragment.graphql';

export const ProductByIdQuery = gql`
  ${ProductFieldsFragment}

  query ProductById($id: ID!) {
    ProductById(id: $id) {
      ...ProductFields
    }
  }
`;

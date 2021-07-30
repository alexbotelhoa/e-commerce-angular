import gql from 'graphql-tag';
import { ProductFieldsFragment } from '../fragments/product.fragment.graphql';

export const ProductAllQuery = gql`
  ${ProductFieldsFragment}

  query ProductAll {
    productAll {
      ...ProductFields
    }
  }
`;

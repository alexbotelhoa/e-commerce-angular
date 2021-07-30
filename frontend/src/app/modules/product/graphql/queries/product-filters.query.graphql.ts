import gql from 'graphql-tag';
import { ProductFieldsFragment } from '../fragments/product.fragment.graphql';

export const ProductIdQuery = gql`
  ${ProductFieldsFragment}

  query ProductByField($filter: productQueryInput!) {
    productByField(fields: $filter) {
      ...ProductFields
    }
  }
`;

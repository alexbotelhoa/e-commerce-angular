import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
export type ProductFieldsFragment = (
  { readonly __typename: 'Product' }
  & Pick<Types.Product, 'id' | 'name' | 'price' | 'categoryId' | 'createdAt' | 'updatedAt'>
);

export const ProductFieldsFragmentDoc = gql`
    fragment ProductFields on Product {
  id
  name
  price
  categoryId
  createdAt
  updatedAt
}
    `;
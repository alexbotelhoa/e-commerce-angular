import * as Types from '../../../../../shared/graphql/generated/types';

import { CategoryFieldsFragment } from '../../../../category/graphql/fragments/__generated__/category.fragment.graphql.generated';
import gql from 'graphql-tag';
import { CategoryFieldsFragmentDoc } from '../../../../category/graphql/fragments/__generated__/category.fragment.graphql.generated';
export type ProductFieldsFragment = (
  { readonly __typename: 'Product' }
  & Pick<Types.Product, 'id' | 'name' | 'price' | 'categoryId' | 'createdAt' | 'updatedAt'>
  & { readonly category: Types.Maybe<ReadonlyArray<Types.Maybe<(
    { readonly __typename: 'Category' }
    & CategoryFieldsFragment
  )>>> }
);

export const ProductFieldsFragmentDoc = gql`
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
    ${CategoryFieldsFragmentDoc}`;
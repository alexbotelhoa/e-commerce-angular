import * as Types from '../../../../../shared/graphql/generated/types';

import gql from 'graphql-tag';
export type CategoryFieldsFragment = (
  { readonly __typename: 'Category' }
  & Pick<Types.Category, 'id' | 'name' | 'createdAt' | 'updatedAt'>
);

export const CategoryFieldsFragmentDoc = gql`
    fragment CategoryFields on Category {
  id
  name
  createdAt
  updatedAt
}
    `;
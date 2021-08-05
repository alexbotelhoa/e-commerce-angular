import gql from 'graphql-tag';
import { CategoryFieldsFragment } from '../fragments/category.fragment.graphql';

export const DeleteCategoryMutation = gql`
  ${CategoryFieldsFragment}

  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

import gql from 'graphql-tag';
import { CategoryFieldsFragment } from '../fragments/category.fragment.graphql';

export const CreateCategoryMutation = gql`
  ${CategoryFieldsFragment}

  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      id
      name
    }
  }
`;

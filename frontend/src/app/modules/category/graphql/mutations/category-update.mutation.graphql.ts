import gql from 'graphql-tag';
import { CategoryFieldsFragment } from '../fragments/category.fragment.graphql';

export const UpdateCategoryMutation = gql`
  ${CategoryFieldsFragment}

  mutation UpdateCategory($data: UpdateCategoryInput!) {
    updateCategory(data: $data) {
      ... on Category {
        id
        name
      }
    }
  }
`;

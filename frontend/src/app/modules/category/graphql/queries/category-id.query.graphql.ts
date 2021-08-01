import gql from 'graphql-tag';
import { CategoryFieldsFragment } from '../fragments/category.fragment.graphql';

export const CategoryByIdQuery = gql`
  ${CategoryFieldsFragment}

  query CategoryById($id: ID!) {
    categoryById(id: $id) {
      ...CategoryFields
    }
  }
`;

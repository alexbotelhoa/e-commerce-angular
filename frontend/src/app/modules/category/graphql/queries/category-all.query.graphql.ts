import gql from 'graphql-tag';
import { CategoryFieldsFragment } from '../fragments/category.fragment.graphql';

export const CategoryAllQuery = gql`
  ${CategoryFieldsFragment}

  query CategoryAll {
    categoryAll {
      ...CategoryFields
    }
  }
`;

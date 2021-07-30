import gql from 'graphql-tag';
import { CategoryFieldsFragment } from '../fragments/category.fragment.graphql';

export const CategoryFiltersQuery = gql`
  ${CategoryFieldsFragment}

  query CategoryByField($filter: categoryQueryInput!) {
    categoryByField(fields: $filter) {
      ...CategoryFields
    }
  }
`;

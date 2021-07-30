import { GQLResolvers } from "../../resolvers-types";
import {
  userAllQueryResolver,
  userByIdQueryResolver,
  userByFieldQueryResolver,
} from "../../modules/user/query/user.query";
import {
  categoryAllQueryResolver,
  categoryByIdQueryResolver,
  categoryByFieldQueryResolver,
} from "./../../modules/category/query/category.query";
import {
  productAllQueryResolver,
  productByIdQueryResolver,
  productByFieldQueryResolver,
} from "./../../modules/product/query/product.query";

export const queryResolvers: GQLResolvers["Query"] = {
  userAll: userAllQueryResolver,
  userById: userByIdQueryResolver,
  userByField: userByFieldQueryResolver,
  categoryAll: categoryAllQueryResolver,
  categoryById: categoryByIdQueryResolver,
  categoryByField: categoryByFieldQueryResolver,
  productAll: productAllQueryResolver,
  productById: productByIdQueryResolver,
  productByField: productByFieldQueryResolver,
};

import { GQLResolvers } from "../../resolvers-types";
import {
  userAllQueryResolver,
  userIdQueryResolver,
  userQueryResolver,
} from "../../modules/user/query/user.query";
import {
  productAllQueryResolver,
  productIdQueryResolver,
  productQueryResolver,
} from "./../../modules/product/query/product.query";
import {
  categoryAllQueryResolver,
  categoryIdQueryResolver,
  categoryQueryResolver,
} from "./../../modules/category/query/category.query";

export const queryResolvers: GQLResolvers["Query"] = {
  userAll: userAllQueryResolver,
  userId: userIdQueryResolver,
  user: userQueryResolver,
  categoryAll: categoryAllQueryResolver,
  categoryId: categoryIdQueryResolver,
  category: categoryQueryResolver,
  productAll: productAllQueryResolver,
  productId: productIdQueryResolver,
  product: productQueryResolver,
};

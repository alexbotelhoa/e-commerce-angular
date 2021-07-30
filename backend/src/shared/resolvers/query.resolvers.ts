import { GQLResolvers } from "../../resolvers-types";
import { userAllQueryResolver, userIdQueryResolver } from '../../modules/user/query/user.query';
import { productAllQueryResolver, productIdQueryResolver } from './../../modules/product/query/product.query';
import { categoryAllQueryResolver, categoryIdQueryResolver } from './../../modules/category/query/category.query';

export const queryResolvers: GQLResolvers['Query'] = {
    userAll: userAllQueryResolver,
    userId: userIdQueryResolver,
    categoryAll: categoryAllQueryResolver,
    categoryId: categoryIdQueryResolver,
    productAll: productAllQueryResolver,
    productId: productIdQueryResolver
}

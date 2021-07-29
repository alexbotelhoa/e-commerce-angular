import { GQLResolvers } from "../../resolvers-types";
import { userQueryResolver } from '../../modules/user/query/user.query';
import { productQueryResolver } from './../../modules/product/query/product.query';
import { categoryQueryResolver } from './../../modules/category/query/category.query';

export const queryResolvers: GQLResolvers['Query'] = {
    user: userQueryResolver,
    category: categoryQueryResolver,
    product: productQueryResolver
}

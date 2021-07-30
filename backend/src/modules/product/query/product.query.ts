import { GQLQueryResolvers } from "../../../resolvers-types";
import { getProductById, selectProduct } from "../../../shared/repositories/product.repository";

export const productAllQueryResolver: GQLQueryResolvers['productAll'] = (obj, params, context) => {
    return selectProduct(context.database);
}

export const productIdQueryResolver: GQLQueryResolvers['productId'] = (obj, { filters }: { filters: { id: any }}, context) => {
    return getProductById(context.database)(filters.id);
}

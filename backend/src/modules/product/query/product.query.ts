import { GQLQueryResolvers } from "../../../resolvers-types";
import { getProductById } from "../../../shared/repositories/product.repository";

export const productQueryResolver: GQLQueryResolvers['product'] = (obj, { filters }: { filters: { id: any }}, context) => {
    return getProductById(context.database)(filters.id);
}

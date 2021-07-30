import { GQLQueryResolvers } from "../../../resolvers-types";
import { getProductById, selectProduct } from "../../../shared/repositories/product.repository";

export const productAllQueryResolver: GQLQueryResolvers['productAll'] = (obj, params, context) => {
    return selectProduct(context.database);
}

export const productByIdQueryResolver: GQLQueryResolvers['productById'] = (obj, params, context) => {
    return getProductById(context.database)(params.id);
}

export const productByFieldQueryResolver: GQLQueryResolvers['productByField'] = (obj, { fields }: { fields: { id: any }}, context) => {
    return getProductById(context.database)(fields.id);
}

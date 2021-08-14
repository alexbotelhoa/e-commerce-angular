import { GQLQueryResolvers } from "../../../resolvers-types";
import { getProductById, selectProduct } from "../../../shared/repositories/product.repository";

export const productAllQueryResolver: GQLQueryResolvers['productAll'] = async (obj, params, context) => {
    return await selectProduct(context.readonlyDatabase);
}

export const productByIdQueryResolver: GQLQueryResolvers['productById'] = async (obj, params, context) => {
    return await getProductById(context.readonlyDatabase)(params.id);
}

export const productByFieldQueryResolver: GQLQueryResolvers['productByField'] = async (obj, { fields }, context) => {
    const query = selectProduct(context.readonlyDatabase);

    if (fields) {
        if (fields.name && fields.name.length > 0) {
            query.where("name", "like", `%${fields.name}%`);
        };
        if (fields.price && fields.price > 0) {
            query.where("price", "=", `%${fields.price}%`);
        };
    }

    return await query;
}

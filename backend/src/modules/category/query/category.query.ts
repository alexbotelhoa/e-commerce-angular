import { GQLQueryResolvers } from "../../../resolvers-types";
import { getCategoryById, selectCategory } from "../../../shared/repositories/category.repository";

export const categoryAllQueryResolver: GQLQueryResolvers['categoryAll'] = async (obj, params, context) => {
    return await selectCategory(context.database);
}

export const categoryByIdQueryResolver: GQLQueryResolvers['categoryById'] = async (obj, params, context) => {
    return await getCategoryById(context.database)(params.id);
}

export const categoryByFieldQueryResolver: GQLQueryResolvers['categoryByField'] = async (obj, { fields }, context) => {
    const query = selectCategory(context.readonlyDatabase);

    if (fields) {
        if (fields.name && fields.name.length > 0) {
            query.where("name", "like", `%${fields.name}%`);
        }
    }

    return await query;
}

import { GQLQueryResolvers } from "../../../resolvers-types";
import { getCategoryById, selectCategory } from "../../../shared/repositories/category.repository";

export const categoryAllQueryResolver: GQLQueryResolvers['categoryAll'] = (obj, params, context) => {
    return selectCategory(context.database);
}

export const categoryByIdQueryResolver: GQLQueryResolvers['categoryById'] = (obj, params, context) => {
    return getCategoryById(context.database)(params.id);
}

export const categoryByFieldQueryResolver: GQLQueryResolvers['categoryByField'] = (obj, { fields }: { fields: { id: any } }, context) => {
    return getCategoryById(context.database)(fields.id);
}

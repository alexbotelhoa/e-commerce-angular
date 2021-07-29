import { GQLQueryResolvers } from "../../../resolvers-types";
import { getCategoryById } from "../../../shared/repositories/category.repository";

export const categoryQueryResolver: GQLQueryResolvers['category'] = (obj, { filters }: { filters: { id: any } }, context) => {
    return getCategoryById(context.database)(filters.id);
}

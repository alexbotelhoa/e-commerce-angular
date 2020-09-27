import { GQLQueryResolvers } from "../../../../resolvers-types";
import { getClassById } from "../../../../shared/repositories/class.repository";

export const classQueryResolver: GQLQueryResolvers['class'] = async (obj, params, context) => {
    return await getClassById(context.database)(params.id);
}

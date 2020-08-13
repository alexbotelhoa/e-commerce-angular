import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectClass } from "../../../../shared/repositories/class.repository";

export const classesQueryResolver: GQLQueryResolvers['classes'] = async (obj, params, context) => {
    return await selectClass(context.database);
}

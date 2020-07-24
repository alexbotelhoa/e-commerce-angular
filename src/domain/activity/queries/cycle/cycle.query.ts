import { GQLQueryResolvers } from "../../../../resolvers-types";
import { getCycleById } from "../../../../shared/repositories/cycle.repository";

export const cycleQuery: GQLQueryResolvers['cycle'] = async (obj, { id }, context) => {
    return getCycleById(context.database)(id);
}

import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectCycle } from "../../../../shared/repositories/cycle.repository";

export const cyclesQueryResolver: GQLQueryResolvers['cycles'] = (obj, params, context) => {
    return selectCycle(context.database);
}
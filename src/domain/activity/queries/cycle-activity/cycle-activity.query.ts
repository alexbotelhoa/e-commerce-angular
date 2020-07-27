import { GQLQueryResolvers } from "../../../../resolvers-types";
import { getCycleActivityById } from "../../../../shared/repositories/cycle-activity.repository";

export const cycleActivityQueryResolver: GQLQueryResolvers['cycleActivity'] = (obj, { id }, context) => {
    return getCycleActivityById(context.database)(id);
}
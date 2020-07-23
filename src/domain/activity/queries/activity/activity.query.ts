import { GQLQueryResolvers } from "../../../../resolvers-types";
import { getActivityById } from "../../../../shared/repositories/activity.repository";

export const activityQuery: GQLQueryResolvers['activity'] = async (obj, params, context) => {
    return getActivityById(context.database)(parseInt(params.id, 10));
}

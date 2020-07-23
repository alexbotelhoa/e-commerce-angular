import { selectActivity } from "../../../../shared/repositories/activity.repository";
import { GQLQueryResolvers } from "../../../../resolvers-types";

export const activitiesQuery: GQLQueryResolvers['activities'] = (obj, params, context) => {
    return selectActivity(context.database);
}

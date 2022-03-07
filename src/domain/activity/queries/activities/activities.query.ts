import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectActivity } from "../../../../shared/repositories/activity.repository";

export const activitiesQueryResolver: GQLQueryResolvers['activities'] = (obj, params, context) => {
    return selectActivity(context.database);
}

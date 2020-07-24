import { selectActivity } from "../../../../shared/repositories/activity.repository";
import { GQLQueryResolvers } from "../../../../resolvers-types";

export const activitiesQueryResolver: GQLQueryResolvers['activities'] = (obj, params, context) => {
    return selectActivity(context.database);
}

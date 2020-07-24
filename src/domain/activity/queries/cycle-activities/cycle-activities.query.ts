import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectCycleActivity } from "../../../../shared/repositories/cycle-activity.repository";

export const cycleActivitiesQueryResolver: GQLQueryResolvers['cycleActivities'] = (obj, params, context) => {
    return selectCycleActivity(context.database);
}
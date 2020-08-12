import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectCycleActivity } from "../../../../shared/repositories/cycle-activity.repository";
import { selectActivity } from "../../../../shared/repositories/activity.repository";

export const availableActivitiesForCycleResolver: GQLQueryResolvers['availableActivitiesForCycle'] = async (obj, params, context) => {
    const selectedCycleActivities = await selectCycleActivity(context.database).andWhere('cycleId', params.cycleId);
    const selectedActivitiesIds = selectedCycleActivities.map(activity => activity.activityId);
    const availableActivities = await selectActivity(context.database)
        .andWhere('active', true)
        .whereNotIn('id', selectedActivitiesIds);
    return availableActivities;
}

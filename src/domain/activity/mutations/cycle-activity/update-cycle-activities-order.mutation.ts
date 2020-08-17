import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getCycleActivitiesByIds, updateCycleActivity } from "../../../../shared/repositories/cycle-activity.repository";

export const updateCycleActivitiesOrderMutation: GQLMutationResolvers['updateCycleActivitiesOrder'] = async (obj, { data }, context) => {
    const cycleActivityIds = data.map(entity => entity.cycleActivityId);
    const cycleActivities = await getCycleActivitiesByIds(context.database)(cycleActivityIds);
    if (cycleActivities.length !== data.length) {
        throw new Error(`Unable to find all cycle activities with ids ${cycleActivityIds}`)
    }
    // using standard for lets us make use of async/await to update them sequentially
    for (let index = 0; index < data.length; index++) {
        const cycleActivity = data[index];
        await updateCycleActivity(context.database)({
            id: parseInt(cycleActivity.cycleActivityId, 10),
            order: cycleActivity.order,
        })(builder => builder.andWhere('id', cycleActivity.cycleActivityId));
    }
    return await getCycleActivitiesByIds(context.database)(cycleActivityIds).orderBy('order', 'asc');
}

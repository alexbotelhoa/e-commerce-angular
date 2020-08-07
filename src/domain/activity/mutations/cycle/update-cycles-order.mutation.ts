import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getCyclesByIds, updateCycle } from "../../../../shared/repositories/cycle.repository";

export const updateCyclesOrderMutation: GQLMutationResolvers['updateCyclesOrder'] = async (obj, { data }, context) => {
    const cycleIds = data.map(entity => entity.cycleId);
    const cycle = await getCyclesByIds(context.database)(cycleIds);
    if (cycle.length !== data.length) {
        throw new Error(`Unable to find all cycles with ids ${cycleIds}`)
    }
    // using standard for lets us make use of async/await to update them sequentially
    for (let index = 0; index < data.length; index++) {
        const cycle = data[index];
        await updateCycle(context.database)({
            id: parseInt(cycle.cycleId, 10),
            order: cycle.order,
        })(builder => builder.andWhere('id', cycle.cycleId));
    }
    return await getCyclesByIds(context.database)(cycleIds).orderBy('order', 'asc');
}

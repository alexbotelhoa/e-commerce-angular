import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getCycleById, insertCycle, updateCycle } from "../../../../shared/repositories/cycle.repository";

import { CYCLE_ACTIVITY_TABLE } from "../../../../entities/cycle-activity.entity"


export const createCycleMutationResolver: GQLMutationResolvers['createCycle'] = async (obj, { data: { name, levelThemeId, active } }, context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getCycleById(context.database)(await insertCycle(context.database)({
        name,
        levelThemeId: parseInt(levelThemeId, 10),
        active: active || undefined
    })))!;
}

export const addActivitiesToCycleMutationResolver: GQLMutationResolvers['addActivitiesToCycle'] = async (obj, { data: { cycleId, items } }, { database: db }) => {
    const bulkInsert = items.map(item => ({ ...item, cycleId }))
    await db.insert(bulkInsert).into(CYCLE_ACTIVITY_TABLE)
    return await getCycleById(db)(cycleId)
}

export const toggleCycleState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateCycle'] | GQLMutationResolvers['deactivateCycle'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getCycleById(db)(await updateCycle(db)(data)(builder => builder.andWhere('id', id))))!;
        }
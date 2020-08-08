import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getCycleById, insertCycle, updateCycle, deleteCycle } from "../../../../shared/repositories/cycle.repository";

import { CYCLE_ACTIVITY_TABLE } from "../../../../entities/cycle-activity.entity"
import { getLevelThemeById } from "../../../../shared/repositories/level-theme.repository";
import { getCycleActivityById, deleteCycleActivity } from "../../../../shared/repositories/cycle-activity.repository";


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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getCycleById(db)(cycleId))!
}

export const toggleCycleState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateCycle'] | GQLMutationResolvers['deactivateCycle'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            await updateCycle(db)(data)(builder => builder.andWhere('id', parseInt(id)))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getCycleById(db)(id))!;
        }

export const deleteCycleFromLevelThemeMutation: GQLMutationResolvers['deleteCycleFromLevelTheme'] = async (obj, data, context) => {
    const cycle = await getCycleById(context.database)(data.cycleId);
    if (!cycle) {
        throw new Error(`Cycle with id ${data.cycleId} not found.`);
    }
    await deleteCycle(context.database)(builder => builder.andWhere('id', data.cycleId).andWhere('levelThemeId', data.cycleId));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getLevelThemeById(context.database)(cycle.levelThemeId))!;
}

export const deleteActivityFromCycleMutation: GQLMutationResolvers['deleteActivityFromCycle'] = async (obj, data, context) => {
    const cycleActivity = await getCycleActivityById(context.database)(data.cycleActivityId);
    if (!cycleActivity) {
        throw new Error(`Cycle activity not found with id ${data.cycleActivityId}`);
    }
    await deleteCycleActivity(context.database)(builder => builder.andWhere('id', data.cycleActivityId));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getCycleById(context.database)(cycleActivity.cycleId))!
}

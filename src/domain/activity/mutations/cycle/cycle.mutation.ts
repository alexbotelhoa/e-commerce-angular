import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getCycleById, insertCycle, updateCycle } from "../../../../shared/repositories/cycle.repository";

import { getCycleActivitysByIds } from "../../../../shared/repositories/cycle-activity.repository"
import { CYCLE_ACTIVITY_TABLE } from "../../../../entities/cycle-activity.entity"
import { getOneOrFail } from "../../../../shared/utils/get-one-or-null.util"


export const createCycleMutationResolver: GQLMutationResolvers['createCycle'] = async (obj, { data: { name, levelThemeId, active } }, context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getCycleById(context.database)(await insertCycle(context.database)({
        name,
        levelThemeId: parseInt(levelThemeId, 10),
        active: active || undefined
    })))!;
}

export const addActivitiesToCycleMutationResolver: GQLMutationResolvers['addActivitiesToCycle'] = async (obj, { id, activityIds, orders }, { database: db }) => {
    const idList = [],
        activityListLength = activityIds.length

    if (orders && activityListLength != orders.length) {
        throw new Error('activityIds and orders must have the same length!')
    }

    for (let i = 0; i < activityListLength; ++i) {
        const activityId = activityIds[i],
            order = orders ? orders[i] : undefined

        idList.push(await db.insert({ cycleId: id, activityId, order }).into(CYCLE_ACTIVITY_TABLE).then(getOneOrFail))
    }

    return await getCycleActivitysByIds(db)(idList)
}

export const toggleCycleState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateCycle'] | GQLMutationResolvers['deactivateCycle'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getCycleById(db)(await updateCycle(db)(data)(builder => builder.andWhere('id', id))))!;
        }
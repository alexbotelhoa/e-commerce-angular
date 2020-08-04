import { GQLCycleActivityResolvers } from "../../resolvers-types"
import { getCycleById } from "../repositories/cycle.repository"
import { getActivityById } from "../repositories/activity.repository";
import { CycleActivityEntity } from "../../entities/cycle-activity.entity";

const levelThemeEntityResolvers: Pick<GQLCycleActivityResolvers, keyof CycleActivityEntity> = {
    id: obj => obj.id.toString(),
    order: obj => obj.order,
    cycleId: obj => obj.cycleId.toString(),
    activityId: obj => obj.activityId.toString(),
}

export const cycleResolver: GQLCycleActivityResolvers['cycle'] = async (obj, params, { database: db }) => {
    const cycle = await getCycleById(db)(obj.cycleId);

    if (cycle) {
        return cycle;
    }

    throw new Error('Non-existent cycle entity!')
}

export const activityResolver: GQLCycleActivityResolvers['activity'] = async (obj, params, { database: db }) => {
    const activity = await getActivityById(db)(obj.activityId);

    if (activity) {
        return activity;
    }

    throw new Error('Non-existent activity entity!')
}

export const cycleActivityResolvers: GQLCycleActivityResolvers = {
    ...levelThemeEntityResolvers,
    cycle: cycleResolver,
    activity: activityResolver
}

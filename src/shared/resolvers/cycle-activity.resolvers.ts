import { GQLResolvers, GQLCycleActivityResolvers } from "../../resolvers-types"


import { getCycleById } from "../repositories/cycle.repository"

import { getActivityById } from "../repositories/activity.repository";

import { CycleActivityEntity } from "../../entities/cycle-activity.entity";

import { extract } from "../utils/prop-extract"

const levelThemeEntityResolvers: Pick<GQLCycleActivityResolvers, keyof CycleActivityEntity> = {
    id: extract('id', String),
    order: extract('order'),
    cycleId: extract('cycleId', String),
    activityId: extract('activityId', String),
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

export const cycleActivityResolvers: GQLResolvers['CycleActivity'] = {
    ...levelThemeEntityResolvers,
    cycle: cycleResolver,
    activity: activityResolver
}
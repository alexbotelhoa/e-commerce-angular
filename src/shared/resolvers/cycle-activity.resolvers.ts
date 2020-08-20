import { GQLCycleActivityResolvers } from "../../resolvers-types"
import { getCycleById } from "../repositories/cycle.repository"
import { getActivityById, selectActivity } from "../repositories/activity.repository";
import { CycleActivityEntity } from "../../entities/cycle-activity.entity";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { ActivityEntity } from "../../entities/activity.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { selectCycleActivity } from "../repositories/cycle-activity.repository";

const cycleActivityEntityResolvers: Pick<GQLCycleActivityResolvers, keyof CycleActivityEntity> = {
    id: obj => obj.id.toString(),
    order: obj => obj.order,
    cycleId: obj => obj.cycleId.toString(),
    activityId: obj => obj.activityId.toString(),
}

export const cycleResolver: GQLCycleActivityResolvers['cycle'] = async (obj, params, context) => {
    const cycle = await getCycleById(context.database)(obj.cycleId);

    if (cycle) {
        return cycle;
    }

    throw new Error('Non-existent cycle entity!')
}

const cycleActivityActivityByIdSorter = createDataloaderSingleSort<ActivityEntity, number, ActivityEntity>('id');

const cycleActivityActivityByIdLoader: DatabaseLoaderFactory<number, ActivityEntity, ActivityEntity> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectActivity(db).whereIn('id', ids);
        const result = cycleActivityActivityByIdSorter(ids)(entities);
        return result;
    }
});


export const cycleActivityActivityFieldResolver: GQLCycleActivityResolvers['activity'] = async (obj, params, context) => {
    return context.getDatabaseLoader(cycleActivityActivityByIdLoader).load(obj.activityId);

}


export const cycleActivityNextActivityFieldResolver: GQLCycleActivityResolvers['nextActivity'] = async (obj, params, context) => {
    const next = await selectCycleActivity(context.database)
        .andWhere('cycleId', obj.cycleId)
        .andWhere('order', '>', obj.order)
        .orderBy('order', 'asc')
        .limit(1)
        .first();
    return next || null;
};

export const cycleActivityPreviousActivityFieldResolver: GQLCycleActivityResolvers['previousActivity'] = async (obj, params, context) => {
    const previous = await selectCycleActivity(context.database)
        .andWhere('cycleId', obj.cycleId)
        .andWhere('order', '<', obj.order)
        .orderBy('order', 'desc')
        .limit(1)
        .first();
    return previous || null;
};

export const cycleActivityResolvers: GQLCycleActivityResolvers = {
    ...cycleActivityEntityResolvers,
    cycle: cycleResolver,
    activity: cycleActivityActivityFieldResolver,
    nextActivity: cycleActivityNextActivityFieldResolver,
    previousActivity: cycleActivityPreviousActivityFieldResolver,
}

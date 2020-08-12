import { GQLCycleResolvers } from "../../resolvers-types"

import { CycleActivityEntity, CYCLE_ACTIVITY_TABLE } from "../../entities/cycle-activity.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectCycleActivity } from "../repositories/cycle-activity.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelThemeById } from "../repositories/level-theme.repository";

import { CycleEntity } from "../../entities/cycle.entity";

import { CountObj } from "../types/count-obj.type"

const cycleEntityResolvers: Pick<GQLCycleResolvers, keyof CycleEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    active: obj => obj.active,
    order: obj => obj.order,
    levelThemeId: obj => obj.levelThemeId.toString(),
}

const cycleActivitiesSorter = createDataloaderMultiSort<CycleActivityEntity, number>('cycleId');

const cycleActivitiesDataloader: DatabaseLoaderFactory<number, CycleActivityEntity[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectCycleActivity(db).whereIn('cycleId', ids).orderBy('order', 'asc');
        const sortedEntities = cycleActivitiesSorter(ids)(entities);
        return sortedEntities;
    }
})

export const cycleActivitiesResolver: GQLCycleResolvers['activities'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(cycleActivitiesDataloader);
    const cycleActivities = await dataloader.load(obj.id);
    return cycleActivities;
}

export const cycleLevelThemeResolver: GQLCycleResolvers['levelTheme'] = async (obj, params, { database: db }) => {
    const levelTheme = await getLevelThemeById(db)(obj.levelThemeId);

    if (levelTheme) {
        return levelTheme;
    }

    throw new Error('Non-existent levelTheme entity!')
}

const totalActivitiesSorter = createDataloaderMultiSort<CountObj, number>('cycleId');

const totalActivitiesDataloader: DatabaseLoaderFactory<number, CountObj[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await db.select('cycleId').count('*').from(CYCLE_ACTIVITY_TABLE).whereIn('cycleId', ids).groupBy('cycleId');
        const sortedEntities = totalActivitiesSorter(ids)(entities);
        return sortedEntities;
    }
})

export const totalActivitiesResolver: GQLCycleResolvers['totalActivities'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(totalActivitiesDataloader);
    const cycleActivities = await dataloader.load(obj.id),
        totalCycles = cycleActivities.find(cycleActivity => cycleActivity.cycleId == obj.id);

    return totalCycles ? totalCycles['count(*)'] : 0;
}

export const cycleResolvers: GQLCycleResolvers = {
    ...cycleEntityResolvers,
    levelTheme: cycleLevelThemeResolver,
    activities: cycleActivitiesResolver,
    totalActivities: totalActivitiesResolver
}



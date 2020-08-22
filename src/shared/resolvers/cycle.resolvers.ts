import { GQLCycleResolvers } from "../../resolvers-types"

import { CycleActivityEntity } from "../../entities/cycle-activity.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectCycleActivity, countCycleActivities } from "../repositories/cycle-activity.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelThemeById } from "../repositories/level-theme.repository";

import { CycleEntity } from "../../entities/cycle.entity";

import { CountObj } from "../types/count-obj.type"
import { createDataloaderCountSort } from "../utils/dataloader-count-sort";

const cycleEntityResolvers: Pick<GQLCycleResolvers, keyof CycleEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    active: obj => obj.active,
    order: obj => obj.order,
    levelThemeId: obj => obj.levelThemeId.toString(),
}

const cycleActivitiesSorter = createDataloaderMultiSort<CycleActivityEntity, number>('cycleId');

const cycleActivitiesDataloader: DatabaseLoaderFactory<number, CycleActivityEntity[]> = {
    id: 'cycleActivitiesDataloader',
    batchFn: db => async (ids) => {
        const entities = await selectCycleActivity(db).whereIn('cycleId', ids).orderBy('order', 'asc');
        const sortedEntities = cycleActivitiesSorter(ids)(entities);
        return sortedEntities;
    }
}

export const cycleActivitiesResolver: GQLCycleResolvers['activities'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(cycleActivitiesDataloader, undefined);
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
type TotalActivitiesQueryResult = CountObj & Pick<CycleActivityEntity, 'cycleId'>;

const totalActivitiesSorter = createDataloaderCountSort<TotalActivitiesQueryResult, number>('cycleId');

const totalActivitiesDataloader: DatabaseLoaderFactory<number, number> = {
    id: 'totalActivitiesDataloader',
    batchFn: db => async (ids) => {
        const entities = await countCycleActivities(db)
            .select('cycleId')
            .whereIn('cycleId', ids)
            .groupBy<TotalActivitiesQueryResult[]>('cycleId');
        const sortedEntities = totalActivitiesSorter(ids)(entities);
        return sortedEntities;
    }
}

export const totalActivitiesResolver: GQLCycleResolvers['totalActivities'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(totalActivitiesDataloader, undefined);
    const totalActivities = await dataloader.load(obj.id);
    return totalActivities;
}

export const cycleViewerHasCompletedResolver: GQLCycleResolvers['viewerHasCompleted'] = async (obj, params, context) => {
    return Math.random() >= 0.5;
}

export const cycleResolvers: GQLCycleResolvers = {
    ...cycleEntityResolvers,
    levelTheme: cycleLevelThemeResolver,
    activities: cycleActivitiesResolver,
    totalActivities: totalActivitiesResolver,
    viewerHasCompleted: cycleViewerHasCompletedResolver,
}



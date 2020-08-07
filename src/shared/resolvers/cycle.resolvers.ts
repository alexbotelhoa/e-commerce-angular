import { GQLCycleResolvers } from "../../resolvers-types"

import { CycleActivityEntity } from "../../entities/cycle-activity.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectCycleActivity } from "../repositories/cycle-activity.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelThemeById } from "../repositories/level-theme.repository";

import { CycleEntity } from "../../entities/cycle.entity";

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
        const entities = await selectCycleActivity(db).whereIn('cycleId', ids);
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

export const cycleResolvers: GQLCycleResolvers = {
    ...cycleEntityResolvers,
    levelTheme: cycleLevelThemeResolver,
    activities: cycleActivitiesResolver
}



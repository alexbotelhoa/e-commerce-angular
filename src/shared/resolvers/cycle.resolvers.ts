import { GQLResolvers, GQLCycleResolvers } from "../../resolvers-types"

import { CycleActivityEntity } from "../../entities/cycle-activity.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectCycleActivity } from "../repositories/cycle-activity.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelThemeById } from "../repositories/level-theme.repository";

import { CycleEntity } from "../../entities/cycle.entity";

import { extract } from "../utils/prop-extract"

const cycleEntityResolvers: Pick<GQLCycleResolvers, keyof CycleEntity> = {
    id: extract('id', String),
    name: extract('name'),
    active: extract('active'),
    levelThemeId: extract('levelThemeId', String),
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

export const cycleResolvers: GQLResolvers['Cycle'] = {
    ...cycleEntityResolvers,
    levelTheme: cycleLevelThemeResolver,
    activities: cycleActivitiesResolver
}



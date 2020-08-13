import { GQLLevelThemeResolvers } from "../../resolvers-types"

import { CycleEntity } from "../../entities/cycle.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectCycle, countCycles } from "../repositories/cycle.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelById } from "../repositories/level.repository";
import { getThemeById } from "../repositories/theme.repository";

import { LevelThemeEntity } from "../../entities/level-theme.entity";

import { CountObj } from "../types/count-obj.type"
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { createDataloaderCountSort } from "../utils/dataloader-count-sort";

const levelThemeEntityResolvers: Pick<GQLLevelThemeResolvers, keyof LevelThemeEntity> = {
    id: obj => obj.id.toString(),
    order: obj => obj.order,
    levelId: obj => obj.levelId.toString(),
    themeId: obj => obj.themeId.toString(),
}

const cyclesSorter = createDataloaderMultiSort<CycleEntity, number>('levelThemeId');

const cyclesDataloader: DatabaseLoaderFactory<number, CycleEntity[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectCycle(db).whereIn('levelThemeId', ids).orderBy('order', 'asc');
        const sortedEntities = cyclesSorter(ids)(entities);
        return sortedEntities;
    }
})

export const levelThemeCyclesResolver: GQLLevelThemeResolvers['cycles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(cyclesDataloader);
    const cycleActivities = await dataloader.load(obj.id);
    return cycleActivities;
}

export const levelResolver: GQLLevelThemeResolvers['level'] = async (obj, params, { database: db }) => {
    const level = await getLevelById(db)(obj.levelId);

    if (level) {
        return level;
    }

    throw new Error('Non-existent level entity!')
}

export const themeResolver: GQLLevelThemeResolvers['theme'] = async (obj, params, { database: db }) => {
    const theme = await getThemeById(db)(obj.themeId);

    if (theme) {
        return theme;
    }

    throw new Error('Non-existent theme entity!')
}

type TotalCyclesQueryResult = CountObj & Pick<CycleEntity, 'levelThemeId'>;

const totalCyclesSorter = createDataloaderCountSort<TotalCyclesQueryResult, number>('levelThemeId');

const totalCyclesDataloader: DatabaseLoaderFactory<number, number> = (db) => ({
    batchFn: async (ids) => {
        const entities = await countCycles(db)
            .select('levelThemeId')
            .whereIn('levelThemeId', ids)
            .groupBy<TotalCyclesQueryResult[]>('levelThemeId');
        const sortedEntities = totalCyclesSorter(ids)(entities);
        return sortedEntities;
    }
})

export const totalCyclesResolver: GQLLevelThemeResolvers['totalCycles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(totalCyclesDataloader);
    const totalCycles = await dataloader.load(obj.id);
    return totalCycles;
}

export const levelThemeResolvers: GQLLevelThemeResolvers = {
    ...levelThemeEntityResolvers,
    level: levelResolver,
    theme: themeResolver,
    cycles: levelThemeCyclesResolver,
    totalCycles: totalCyclesResolver
}

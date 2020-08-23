import { GQLLevelThemeResolvers } from "../../resolvers-types"

import { CycleEntity, CYCLE_TABLE } from "../../entities/cycle.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectCycle, countCycles } from "../repositories/cycle.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelById } from "../repositories/level.repository";
import { getThemeById } from "../repositories/theme.repository";

import { LevelThemeEntity } from "../../entities/level-theme.entity";

import { CountObj } from "../types/count-obj.type"
import { createDataloaderCountSort } from "../utils/dataloader-count-sort";
import { ACTIVITY_TIMER_TABLE } from "../../entities/activities/activity-timer.entity";
import { CYCLE_ACTIVITY_TABLE } from "../../entities/cycle-activity.entity";

const levelThemeEntityResolvers: Pick<GQLLevelThemeResolvers, keyof LevelThemeEntity> = {
    id: obj => obj.id.toString(),
    order: obj => obj.order,
    levelId: obj => obj.levelId.toString(),
    themeId: obj => obj.themeId.toString(),
}

const cyclesSorter = createDataloaderMultiSort<CycleEntity, number>('levelThemeId');

const cyclesDataloader: DatabaseLoaderFactory<number, CycleEntity[]> = {
    id: 'cyclesByLevelThemeId',
    batchFn: db => async (ids) => {
        const entities = await selectCycle(db).whereIn('levelThemeId', ids).orderBy('order', 'asc');
        const sortedEntities = cyclesSorter(ids)(entities);
        return sortedEntities;
    },
}

export const levelThemeCyclesResolver: GQLLevelThemeResolvers['cycles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(cyclesDataloader, undefined);
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

const totalCyclesByLevelThemeIdLoader: DatabaseLoaderFactory<number, number> = {
    id: 'totalCyclesByLevelThemeId',
    batchFn: db => async (ids) => {
        const entities = await countCycles(db)
            .select('levelThemeId')
            .whereIn('levelThemeId', ids)
            .groupBy<TotalCyclesQueryResult[]>('levelThemeId');
        const sortedEntities = totalCyclesSorter(ids)(entities);
        return sortedEntities;
    }
}

export const totalCyclesResolver: GQLLevelThemeResolvers['totalCycles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(totalCyclesByLevelThemeIdLoader, undefined);
    const totalCycles = await dataloader.load(obj.id);
    return totalCycles;
}

type LevelThemeTotalActivitiesQueryResult = CountObj & Pick<CycleEntity, 'levelThemeId'>;


const levelTotalActivitiesSorter = createDataloaderCountSort<LevelThemeTotalActivitiesQueryResult, number>('levelThemeId');

const levelThemeTotalResourcesByLevelThemeIdLoader: DatabaseLoaderFactory<number, number, number> = {
    id: 'levelThemeTotalResourcesByLevelThemeId',
    batchFn: (db) => async (ids) => {
        const entities: LevelThemeTotalActivitiesQueryResult[] = await db
            .count('*')
            .select([`${CYCLE_TABLE}.levelThemeId`])
            .from(CYCLE_ACTIVITY_TABLE)
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .whereIn(`${CYCLE_TABLE}.levelThemeId`, ids)
            .groupBy(`${CYCLE_TABLE}.levelThemeId`);

        const sorted = levelTotalActivitiesSorter(ids)(entities);
        return sorted;
    }
}


export const totalActivitiesFieldResolver: GQLLevelThemeResolvers['totalActivities'] = async (obj, params, context) => {
    return context.getDatabaseLoader(levelThemeTotalResourcesByLevelThemeIdLoader, undefined).load(obj.id);
}


const levelViewerTotalCompletedActivitiesSorter = createDataloaderCountSort<LevelThemeTotalActivitiesQueryResult, number>('levelThemeId');

const levelThemeViewerTotalCompletedActivitiesByLevelThemeIdLoader: DatabaseLoaderFactory<number, number, number, number> = {
    id: 'levelThemeViewerTotalCompletedResourcesByLevelThemeId',
    batchFn: (db, userId) => async (ids) => {
        const entities: LevelThemeTotalActivitiesQueryResult[] = await db
            .count('*')
            .select([`${CYCLE_TABLE}.levelThemeId`])
            .from(ACTIVITY_TIMER_TABLE)
            .innerJoin(CYCLE_ACTIVITY_TABLE, `${CYCLE_ACTIVITY_TABLE}.id`, `${ACTIVITY_TIMER_TABLE}.cycleActivityId`)
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .whereIn(`${CYCLE_TABLE}.levelThemeId`, ids)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.completed`, true)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.userId`, userId)
            .groupBy(`${CYCLE_TABLE}.levelThemeId`);

        const sorted = levelViewerTotalCompletedActivitiesSorter(ids)(entities);
        return sorted;
    }
}

export const levelThemeViewerTotalCompletedActivitiesFieldResolver: GQLLevelThemeResolvers['viewerTotalCompletedActivities'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return 0;
    }
    return context.getDatabaseLoader(levelThemeViewerTotalCompletedActivitiesByLevelThemeIdLoader, user.id).load(obj.id);
}

export const levelThemeResolvers: GQLLevelThemeResolvers = {
    ...levelThemeEntityResolvers,
    level: levelResolver,
    theme: themeResolver,
    cycles: levelThemeCyclesResolver,
    totalCycles: totalCyclesResolver,
    totalActivities: totalActivitiesFieldResolver,
    viewerTotalCompletedActivities: levelThemeViewerTotalCompletedActivitiesFieldResolver,
}

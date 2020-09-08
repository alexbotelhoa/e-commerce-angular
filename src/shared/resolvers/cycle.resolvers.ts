import { GQLCycleResolvers } from "../../resolvers-types"

import { CycleActivityEntity, CYCLE_ACTIVITY_TABLE } from "../../entities/cycle-activity.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectCycleActivity, countCycleActivities } from "../repositories/cycle-activity.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelThemeById } from "../repositories/level-theme.repository";

import { CycleEntity } from "../../entities/cycle.entity";

import { CountObj } from "../types/count-obj.type"
import { createDataloaderCountSort } from "../utils/dataloader-count-sort";
import { ACTIVITY_TIMER_TABLE } from "../../entities/activities/activity-timer.entity";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";

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
        const entities = await selectCycleActivity(db)
            .whereIn('cycleId', ids)
            .orderBy(
                [
                    {
                        column: 'order',
                        order: 'asc'
                    },
                    {
                        column: 'id',
                        order: 'asc'
                    },
                ]
            );
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

export type CycleActivitiesSummaryByCycleId = {
    cycleId: number;
    totalActivities: number;
    completedActivities: number;
}

export const cycleActivitiesSummaryByCycleIdSorter = createDataloaderSingleSort<CycleActivitiesSummaryByCycleId, number>('cycleId');

export const cycleUserHasCompletedLoader
    : DatabaseLoaderFactory<number, boolean, boolean, number> = {
    id: 'cycleUserHasCompleted',
    batchFn: (db, userId) => async (ids) => {
        const entities: CycleActivitiesSummaryByCycleId[] = await db.count('*', { as: 'completedActivities' })
            .select(['cycle_activity.cycleId', 'cycleActivityCount.totalActivities'])
            .from(ACTIVITY_TIMER_TABLE)
            .innerJoin(CYCLE_ACTIVITY_TABLE, `${CYCLE_ACTIVITY_TABLE}.id`, `${ACTIVITY_TIMER_TABLE}.cycleActivityId`)
            .innerJoin(function () {
                this.count('*', { as: 'totalActivities' })
                    .select('cycleId')
                    .from(CYCLE_ACTIVITY_TABLE)
                    .whereIn('cycleId', ids)
                    .groupBy(['cycleId'])
                    .as('cycleActivityCount');
            }, 'cycleActivityCount.cycleId', `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .whereIn(`${CYCLE_ACTIVITY_TABLE}.cycleId`, ids)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.completed`, true)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.userId`, userId)
            .groupBy([`${CYCLE_ACTIVITY_TABLE}.cycleId`]);
        const sorted = cycleActivitiesSummaryByCycleIdSorter(ids)(entities);
        const result = sorted.map(entity => {
            if (!entity) {
                return false;
            }
            return entity.completedActivities === entity.totalActivities;
        });
        return result;
    }
}

export const cycleViewerHasCompletedResolver: GQLCycleResolvers['viewerHasCompleted'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return false;
    }
    return context.getDatabaseLoader(cycleUserHasCompletedLoader, user.id).load(obj.id);
}

export const cycleStudentHasCompletedResolver: GQLCycleResolvers['studentHasCompleted'] = async (obj, params, context) => {
    return context.getDatabaseLoader(cycleUserHasCompletedLoader, parseInt(params.studentId, 10)).load(obj.id);
}

export const cycleResolvers: GQLCycleResolvers = {
    ...cycleEntityResolvers,
    levelTheme: cycleLevelThemeResolver,
    activities: cycleActivitiesResolver,
    totalActivities: totalActivitiesResolver,
    viewerHasCompleted: cycleViewerHasCompletedResolver,
    studentHasCompleted: cycleViewerHasCompletedResolver,
}



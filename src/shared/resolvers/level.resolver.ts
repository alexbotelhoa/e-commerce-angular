import { CountObj } from "../types/count-obj.type";
import { GQLLevelResolvers } from "../../resolvers-types";
import { LevelEntity } from "../../entities/level.entity";
import { CLASS_TABLE } from "../../entities/class.entity";
import { CYCLE_TABLE } from "../../entities/cycle.entity";
import { getOneOrNull } from "../utils/get-one-or-null.util";
import { ENROLLMENT_TABLE } from "../../entities/enrollment.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { selectLevelCode } from "../repositories/level-code.repository";
import { selectLevelTheme } from "../repositories/level-theme.repository";
import { createDataloaderCountSort } from "../utils/dataloader-count-sort";
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";
import { ENROLLMENT_CLASS_TABLE } from "../../entities/enrollment-class.entity";
import { LevelCodeEntity, LEVEL_CODE_TABLE } from "../../entities/level-code.entity";
import { ACTIVITY_TIMER_TABLE } from "../../entities/activities/activity-timer.entity";
import { LevelThemeEntity, LEVEL_THEME_TABLE } from "../../entities/level-theme.entity";
import { CYCLE_ACTIVITY_TABLE, CycleActivityEntity } from "../../entities/cycle-activity.entity";

const levelEntityResolvers: Pick<GQLLevelResolvers, keyof LevelEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    description: obj => obj.description,
    order: obj => obj.order,
    active: obj => obj.active,
    typeId: obj => obj.typeId,
}

const levelThemesSorter = createDataloaderMultiSort<LevelThemeEntity, number>('levelId');

const levelThemesDataloader: DatabaseLoaderFactory<number, LevelThemeEntity[]> = {
    id: 'levelThemesByLevelId',
    batchFn: db => async (ids) => {
        const entities = await selectLevelTheme(db).whereIn('levelId', ids).orderBy('order', 'asc');
        const sortedEntities = levelThemesSorter(ids)(entities);
        return sortedEntities;
    }
}

export const levelThemesResolver: GQLLevelResolvers['levelThemes'] = async (obj, params, context) => {
    return await context.getDatabaseLoader(levelThemesDataloader, undefined).load(obj.id);
}

const levelCodesSorter = createDataloaderMultiSort<LevelCodeEntity, number>('levelId');

const levelCodesByLevelIdLoader: DatabaseLoaderFactory<number, LevelCodeEntity[]> = {
    id: 'levelCodesByLevelId',
    batchFn: db => async (ids) => {
        const entities = await selectLevelCode(db).whereIn('levelId', ids);
        const sortedEntities = levelCodesSorter(ids)(entities);
        return sortedEntities;
    }
}

const levelCodesResolver: GQLLevelResolvers['codes'] = async (obj, params, context) => {
    return await context.getDatabaseLoader(levelCodesByLevelIdLoader, undefined).load(obj.id)
}

const levelViewerEnrollmentClassesFieldResolver: GQLLevelResolvers['viewerClasses'] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) return [];

    return await context.readonlyDatabase
        .select([`${ENROLLMENT_CLASS_TABLE}.*`, `${LEVEL_CODE_TABLE}.levelId`])
        .from(ENROLLMENT_CLASS_TABLE)
        .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.id`, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.id`, `${ENROLLMENT_TABLE}.levelCodeId`)
        .where(`${LEVEL_CODE_TABLE}.levelId`, obj.id)
        .andWhere(`${ENROLLMENT_TABLE}.userId`, userId);
}

type TotalCycleActivitiesQueryResult = CountObj & Pick<LevelThemeEntity, 'levelId'>;

const totalCycleActivitiesSorter = createDataloaderCountSort<TotalCycleActivitiesQueryResult, number>('levelId');

const levelTotalCycleActivitiesByLevelIdLoader: DatabaseLoaderFactory<number, number, number> = {
    id: 'levelTotalCycleActivitiesByLevelId',
    batchFn: db => async (ids) => {
        const entities: TotalCycleActivitiesQueryResult[] = await db
            .count('*')
            .select([`${LEVEL_THEME_TABLE}.levelId`])
            .from(CYCLE_ACTIVITY_TABLE)
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .innerJoin(LEVEL_THEME_TABLE, `${LEVEL_THEME_TABLE}.id`, `${CYCLE_TABLE}.levelThemeId`)
            .whereIn(`${LEVEL_THEME_TABLE}.levelId`, ids)
            .groupBy(`${LEVEL_THEME_TABLE}.levelId`);

        const sorted = totalCycleActivitiesSorter(ids)(entities);
        return sorted;
    }
}

const levelTotalActivitiesFieldResolver: GQLLevelResolvers['totalActivities'] = async (obj, params, context) => {
    return context.getDatabaseLoader(levelTotalCycleActivitiesByLevelIdLoader, undefined).load(obj.id);
}

const levelViewerTotalCompletedActivitiesSorter = createDataloaderCountSort<TotalCycleActivitiesQueryResult, number>('levelId');

const levelViewerTotalCompletedActivitiesByLevelIdLoader: DatabaseLoaderFactory<number, number, number, string> = {
    id: 'levelViewerTotalCompletedActivitiesByLevelId',
    batchFn: (db, userId) => async (ids) => {
        const entities: TotalCycleActivitiesQueryResult[] = await db
            .count('*')
            .select([`${LEVEL_THEME_TABLE}.levelId`])
            .from(ACTIVITY_TIMER_TABLE)
            .innerJoin(CYCLE_ACTIVITY_TABLE, `${CYCLE_ACTIVITY_TABLE}.id`, `${ACTIVITY_TIMER_TABLE}.cycleActivityId`)
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .innerJoin(LEVEL_THEME_TABLE, `${LEVEL_THEME_TABLE}.id`, `${CYCLE_TABLE}.levelThemeId`)
            .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${ACTIVITY_TIMER_TABLE}.classId`)
            .whereIn(`${LEVEL_THEME_TABLE}.levelId`, ids)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.completed`, true)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.userId`, userId)
            .andWhereRaw(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29`)
            .andWhereRaw(`DATEDIFF(${CLASS_TABLE}.startDate, CURDATE()) < 31`)
            .groupBy(`${LEVEL_THEME_TABLE}.levelId`, `${ACTIVITY_TIMER_TABLE}.classId`);

        const sorted = levelViewerTotalCompletedActivitiesSorter(ids)(entities);
        return sorted;
    }
}

const levelViewerTotalCompletedActivitiesFieldResolver: GQLLevelResolvers['viewerTotalCompletedActivities'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return 0;
    }
    return await context.getDatabaseLoader(levelViewerTotalCompletedActivitiesByLevelIdLoader, user.id).load(obj.id);
}

const levelViewerNextUnfinishedActivityFieldResolver: GQLLevelResolvers['viewerNextUnfinishedActivity'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return null;
    }

    const result = await context.database.raw(`
        SELECT cycle_activity.*
        FROM cycle_activity
        INNER JOIN cycle ON cycle.id = cycle_activity.cycleId
        INNER JOIN level_theme ON level_theme.id = cycle.levelThemeId
        WHERE level_theme.levelId = :levelId
        AND NOT EXISTS (
            SELECT *
            FROM activity_timer
            WHERE activity_timer.cycleActivityId = cycle_activity.id
            AND activity_timer.completed = true
            AND activity_timer.userId = :userId
        )
        ORDER BY 
            level_theme.order ASC,
            cycle.order ASC,
            cycle_activity.order ASC
        LIMIT 1
;`, {
        userId: user.id,
        levelId: obj.id,
    });
    const cycleActivity: CycleActivityEntity | null = getOneOrNull(result[0]);
    return cycleActivity;
}

export const levelResolvers: GQLLevelResolvers = {
    ...levelEntityResolvers,
    levelThemes: levelThemesResolver,
    codes: levelCodesResolver,
    totalActivities: levelTotalActivitiesFieldResolver,
    viewerClasses: levelViewerEnrollmentClassesFieldResolver,
    viewerTotalCompletedActivities: levelViewerTotalCompletedActivitiesFieldResolver,
    viewerNextUnfinishedActivity: levelViewerNextUnfinishedActivityFieldResolver,
}

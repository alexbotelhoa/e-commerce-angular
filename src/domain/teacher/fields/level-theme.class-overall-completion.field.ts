import { ENROLLMENT_CLASS_TABLE } from "../../../entities/enrollment-class.entity";
import { ENROLLMENT_TABLE } from "../../../entities/enrollment.entity";
import { USER_TABLE } from "../../../entities/user.entity";
import { GQLLevelThemeResolvers } from "../../../resolvers-types";
import { levelThemeTotalResourcesByLevelThemeIdLoader } from "../../../shared/resolvers/level-theme.resolvers";
import { CountObj } from "../../../shared/types/count-obj.type";
import { DatabaseLoaderFactory } from "../../../shared/types/database-loader.type";
import { createDataloaderCountSort } from "../../../shared/utils/dataloader-count-sort";
import { createDataloaderSingleSort } from "../../../shared/utils/dataloader-single-sort";

export interface LevelThemeClassTotalCompletedActivitiesRow {
    completedActivities: number;
    classId: number;
    levelThemeId: number;
}

const levelThemeClassTotalCompletedActivitiesSorter =
    createDataloaderSingleSort<LevelThemeClassTotalCompletedActivitiesRow, number, LevelThemeClassTotalCompletedActivitiesRow>('levelThemeId')

const levelThemeClassTotalCompletedActivitiesLoader: DatabaseLoaderFactory<number, number, number, number> = {
    id: 'levelThemeClassTotalCompletedActivitiesLoader',
    batchFn: (db, classId) => async ids => {
        const levelThemeIdsParameters = ids.map(() => '?').join(',');
        const result = await db.raw(
            `select count(*) as completedActivities
    , activity_timer.classId as classId
    , level_theme.id as levelThemeId
from activity_timer
inner join class on class.id = activity_timer.classId
inner join level_code on level_code.id = class.levelCodeId
inner join level on level.id = level_code.levelId
inner join level_theme on level.id = level_theme.levelId
where 
activity_timer.completed = true
and activity_timer.classId = ?
and level_theme.id IN (${levelThemeIdsParameters})
group by activity_timer.classId, level_theme.id`
            , [
                classId,
                ...ids,
            ])

        const sorted = levelThemeClassTotalCompletedActivitiesSorter(ids)(result[0]);
        return sorted.map(value => value.completedActivities);
    }
}

type ClassTotalStudentsLoaderRow = CountObj & {
    classId: number;
}

const classTotalStudentsSorter = createDataloaderCountSort<ClassTotalStudentsLoaderRow, number>('classId');

export const classTotalStudentsLoader: DatabaseLoaderFactory<number, number, number, undefined> = {
    id: 'classTotalStudentsLoader',
    batchFn: (db) => async ids => {
        const result = await db
            .count('*')
            .select([`${ENROLLMENT_CLASS_TABLE}.classId`])
            .from(USER_TABLE)
            .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.userId`, `${USER_TABLE}.id`)
            .innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.id`)
            .whereIn(`${ENROLLMENT_CLASS_TABLE}.classId`, ids)
        const sorted = classTotalStudentsSorter(ids)(result);
        return sorted;
    }
}



export const levelThemeClassOverallCompletionFieldResolver: GQLLevelThemeResolvers['classOverallCompletion'] = async (obj, params, context) => {
    const classId = parseInt(params.classId, 10);
    const [
        totalActivities,
        totalActivitiesCompleted,
        totalClassStudents
    ] = await Promise.all(
        [
            context.getDatabaseLoader(levelThemeTotalResourcesByLevelThemeIdLoader, undefined).load(obj.id),
            context.getDatabaseLoader(levelThemeClassTotalCompletedActivitiesLoader, classId).load(obj.id),
            context.getDatabaseLoader(classTotalStudentsLoader, undefined).load(classId)
        ]);

    return totalActivitiesCompleted / totalClassStudents / totalActivities;
}

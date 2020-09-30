import { DatabaseLoaderFactory } from "../../../shared/types/database-loader.type";
import { createDataloaderSingleSort } from "../../../shared/utils/dataloader-single-sort";

export interface LevelThemeClassTotalCompletedActivitiesRow {
    completedActivities: number;
    classId: number;
    levelThemeId: number;
}

export const levelThemeClassTotalCompletedActivitiesSorter =
    createDataloaderSingleSort<LevelThemeClassTotalCompletedActivitiesRow, number, LevelThemeClassTotalCompletedActivitiesRow>('levelThemeId')

export const levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader: DatabaseLoaderFactory<number, number, number, number> = {
    id: 'levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader',
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

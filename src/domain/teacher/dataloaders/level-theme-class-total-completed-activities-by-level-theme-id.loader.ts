import { CountObj } from "../../../shared/types/count-obj.type";
import { DatabaseLoaderFactory } from "../../../shared/types/database-loader.type";
import { createDataloaderCountSort } from "../../../shared/utils/dataloader-count-sort";

export type LevelThemeClassTotalCompletedActivitiesRow = CountObj & {
    classId: number;
    levelThemeId: number;
}

export const levelThemeClassTotalCompletedActivitiesSorter =
    createDataloaderCountSort<LevelThemeClassTotalCompletedActivitiesRow, number>('levelThemeId')

export const levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader: DatabaseLoaderFactory<number, number, number, string> = {
    id: 'levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader',
    batchFn: (db, classId) => async ids => {
        const levelThemeIdsParameters = ids.map(() => '?').join(',');
        const result = await db.raw(
            `select count(*)
    , activity_timer.classId as classId
    , level_theme.id as levelThemeId
from activity_timer
inner join cycle_activity on cycle_activity.id = activity_timer.cycleActivityId
inner join cycle on cycle.id = cycle_activity.cycleId
inner join level_theme on level_theme.id = cycle.levelThemeId
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
        return sorted;
    }
}

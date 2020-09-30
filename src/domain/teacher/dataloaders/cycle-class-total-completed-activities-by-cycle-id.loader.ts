import { ACTIVITY_TIMER_TABLE } from "../../../entities/activities/activity-timer.entity";
import { CLASS_TABLE } from "../../../entities/class.entity";
import { CYCLE_ACTIVITY_TABLE } from "../../../entities/cycle-activity.entity";
import { CYCLE_TABLE } from "../../../entities/cycle.entity";
import { LEVEL_CODE_TABLE } from "../../../entities/level-code.entity";
import { LEVEL_THEME_TABLE } from "../../../entities/level-theme.entity";
import { LEVEL_TABLE } from "../../../entities/level.entity";
import { CountObj } from "../../../shared/types/count-obj.type";
import { DatabaseLoaderFactory } from "../../../shared/types/database-loader.type";
import { createDataloaderCountSort } from "../../../shared/utils/dataloader-count-sort";

export type CycleClassTotalCompletedActivitiesbyCycleIdRow = CountObj & {
    cycleId: number;
    classId: number;
}

const cycleTotalActivitiesSorter = createDataloaderCountSort<CycleClassTotalCompletedActivitiesbyCycleIdRow, number>('cycleId');

export const cycleClassTotalCompletedActivitiesbyCycleIdLoader: DatabaseLoaderFactory<number, number, number, number> = {
    id: 'cycleClassTotalCompletedActivitiesbyCycleId',
    batchFn: (db, classId) => async (ids) => {
        const entities: CycleClassTotalCompletedActivitiesbyCycleIdRow[] = await db
            .count('*')
            .select([`${CYCLE_TABLE}.id as cycleId`, `${ACTIVITY_TIMER_TABLE}.classId as classId`])
            .from(ACTIVITY_TIMER_TABLE)
            .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${ACTIVITY_TIMER_TABLE}.classId`)
            .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.id`, `${CLASS_TABLE}.levelCodeId`)
            .innerJoin(LEVEL_TABLE, `${LEVEL_TABLE}.id`, `${LEVEL_CODE_TABLE}.levelId`)
            .innerJoin(LEVEL_THEME_TABLE, `${LEVEL_THEME_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.levelThemeId`, `${LEVEL_THEME_TABLE}.id`)
            .whereIn(`${CYCLE_TABLE}.id`, ids)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.completed`, true)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.classId`, classId)
            .groupBy([`${ACTIVITY_TIMER_TABLE}.classId`, `${CYCLE_TABLE}.id`]);

        const sorted = cycleTotalActivitiesSorter(ids)(entities);
        return sorted;
    }
}

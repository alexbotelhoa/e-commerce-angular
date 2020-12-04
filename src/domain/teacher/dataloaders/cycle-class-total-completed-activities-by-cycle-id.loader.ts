import { ACTIVITY_TIMER_TABLE } from "../../../entities/activities/activity-timer.entity";
import { CYCLE_ACTIVITY_TABLE } from "../../../entities/cycle-activity.entity";
import { CYCLE_TABLE } from "../../../entities/cycle.entity";
import { CountObj } from "../../../shared/types/count-obj.type";
import { DatabaseLoaderFactory } from "../../../shared/types/database-loader.type";
import { createDataloaderCountSort } from "../../../shared/utils/dataloader-count-sort";

export type CycleClassTotalCompletedActivitiesbyCycleIdRow = CountObj & {
    cycleId: number;
    classId: number;
}

const cycleTotalActivitiesSorter = createDataloaderCountSort<CycleClassTotalCompletedActivitiesbyCycleIdRow, number>('cycleId');

export const cycleClassTotalCompletedActivitiesbyCycleIdLoader: DatabaseLoaderFactory<number, number, number, string> = {
    id: 'cycleClassTotalCompletedActivitiesbyCycleId',
    batchFn: (db, classId) => async (ids) => {
        const entities: CycleClassTotalCompletedActivitiesbyCycleIdRow[] = await db
            .count('*')
            .select([`${CYCLE_TABLE}.id as cycleId`, `${ACTIVITY_TIMER_TABLE}.classId as classId`])
            .from(ACTIVITY_TIMER_TABLE)
            .innerJoin(CYCLE_ACTIVITY_TABLE, `${CYCLE_ACTIVITY_TABLE}.id`, `${ACTIVITY_TIMER_TABLE}.cycleActivityId`)
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .whereIn(`${CYCLE_TABLE}.id`, ids)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.completed`, true)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.classId`, classId)
            .groupBy([`${ACTIVITY_TIMER_TABLE}.classId`, `${CYCLE_TABLE}.id`]);
        const resultFomarted = Array.isArray(entities) ? entities : [entities]
        const sorted = cycleTotalActivitiesSorter(ids)(resultFomarted);
        return sorted;
    }
}

import { CYCLE_ACTIVITY_TABLE } from "../../../entities/cycle-activity.entity";
import { CYCLE_TABLE } from "../../../entities/cycle.entity";
import { CountObj } from "../../../shared/types/count-obj.type";
import { DatabaseLoaderFactory } from "../../../shared/types/database-loader.type";
import { createDataloaderCountSort } from "../../../shared/utils/dataloader-count-sort";

export type CycleTotalActivitiesByCycleIdRow = CountObj & {
    cycleId: number;
}

const cycleTotalActivitiesSorter = createDataloaderCountSort<CycleTotalActivitiesByCycleIdRow, number>('cycleId');

export const cycleTotalActivitiesByCycleIdLoader: DatabaseLoaderFactory<number, number, number> = {
    id: 'cycleTotalActivitiesByCycleId',
    batchFn: (db) => async (ids) => {
        const entities: CycleTotalActivitiesByCycleIdRow[] = await db
            .count('*')
            .select([`${CYCLE_TABLE}.id as cycleId`])
            .from(CYCLE_ACTIVITY_TABLE)
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .whereIn(`${CYCLE_TABLE}.id`, ids)
            .groupBy(`${CYCLE_TABLE}.id`);

        const sorted = cycleTotalActivitiesSorter(ids)(entities);
        return sorted;
    }
}

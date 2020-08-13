import { createRepository } from "../services/repository.service";
import { CycleActivityEntity, CYCLE_ACTIVITY_TABLE } from "../../entities/cycle-activity.entity";

export const {
    getById: getCycleActivityById,
    getManyByIds: getCycleActivitysByIds,
    select: selectCycleActivity,
    insert: insertCycleActivity,
    update: updateCycleActivity,
    delete: deleteCycleActivity,
    deleteAll: deleteAllCycleActivitys,
    count: countCycleActivities,
} = createRepository<CycleActivityEntity>(CYCLE_ACTIVITY_TABLE, 'id');

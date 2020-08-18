import { createRepository } from "../services/repository.service";
import { ACTIVITY_TIMER_TABLE, ActivityTimerEntity } from "../../entities/activities/activity-timer.entity";

export const {
    getById: getActivityTimerById,
    getManyByIds: getActivityTimersByIds,
    select: selectActivityTimer,
    insert: insertActivityTimer,
    update: updateActivityTimer,
    delete: deleteActivityTimer,
    deleteAll: deleteAllActivityTimers,
    count: countActivityTimers,
} = createRepository<ActivityTimerEntity>(ACTIVITY_TIMER_TABLE, 'id');

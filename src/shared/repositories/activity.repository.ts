import { createRepository } from "../services/repository.service";
import { ActivityEntity, ACTIVITY_TABLE } from "../../entities/activity.entity";

export const {
    getById: getActivityById,
    getManyByIds: getActivitiesByIds,
    select: selectActivity,
    insert: insertActivity,
    update: updateActivity,
    delete: deleteActivity,
    deleteAll: deleteAllActivities,
    count: countActivities,
} = createRepository<ActivityEntity>(ACTIVITY_TABLE, 'id');

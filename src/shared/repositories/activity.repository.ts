import { createRepository } from "../services/repository.service";
import { ActivityEntity, ACTIVITY_TABLE } from "../../entities/activity.entity";
import { insert } from "../services/entities/activity.service"

export const {
    getById: getActivityById,
    getManyByIds: getActivitiesByIds,
    select: selectActivity,
    insert: insertActivity,
    update: updateActivity,
    delete: deleteActivity,
    deleteAll: deleteAllActivities,
} = createRepository<ActivityEntity>(ACTIVITY_TABLE, 'id');

// export const insertActivity = insert;
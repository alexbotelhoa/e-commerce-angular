import { createRepository } from "../services/repository.service";
import { EmbeddedActivityDataEntity, EMBEDDED_ACTIVITY_DATA_TABLE } from "../../entities/activities/embedded-activity-data.entity";

export const {
    getById: getEmbeddedActivityDataById,
    getManyByIds: getEmbeddedActivitiesDataByIds,
    select: selectEmbeddedActivityData,
    insert: insertEmbeddedActivityData,
    update: updateEmbeddedActivityData,
    delete: deleteEmbeddedActivityData,
    deleteAll: deleteAllEmbeddedActivitiesData,
    count: countEmbeddedActivityData,
} = createRepository<EmbeddedActivityDataEntity>(EMBEDDED_ACTIVITY_DATA_TABLE, 'activityId');

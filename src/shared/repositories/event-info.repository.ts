import { createRepository } from "../services/repository.service";
import { EventInfoEntity, EVENT_INFO_TABLE } from "../../entities/event-info.entity";

export const {
    getById: getEventInfoById,
    getManyByIds: getEventInfosByIds,
    select: selectEventInfo,
    insert: insertEventInfo,
    update: updateEventInfo,
    delete: deleteEventInfo,
    deleteAll: deleteAllEventInfos,
    count: countEventInfos,
} = createRepository<EventInfoEntity>(EVENT_INFO_TABLE, 'id');

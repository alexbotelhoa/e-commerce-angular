import { createRepository } from "../services/repository.service";
import { EventEntity, EVENT_TABLE } from "../../entities/event.entity";

export const {
    getById: getEventById,
    getManyByIds: getEventsByIds,
    select: selectEvent,
    insert: insertEvent,
    update: updateEvent,
    delete: deleteEvent,
    deleteAll: deleteAllEvents,
    count: countEvents,
} = createRepository<EventEntity>(EVENT_TABLE, 'id');

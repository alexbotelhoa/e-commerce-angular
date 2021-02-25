import { createRepository } from "../services/repository.service";
import { EventAdressEntity, EVENT_ADRESS_TABLE } from "../../entities/event-adress.entity";
import { EventInstructorEntity, EVENT_INSTRUCTOR_TABLE } from "../../entities/event-instructor.entity";

export const {
    getById: getEventInstructorById,
    getManyByIds: getEventInstructorByIds,
    select: selectEventInstructor,
    insert: insertEventInstructor,
    update: updateEventInstructor,
    delete: deleteEventInstructor,
    deleteAll: deleteAllEventInstructor,
    count: countEventInstructor,
} = createRepository<EventInstructorEntity>(EVENT_INSTRUCTOR_TABLE, 'id');

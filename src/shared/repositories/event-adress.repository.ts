import { createRepository } from "../services/repository.service";
import { EventAdressEntity, EVENT_ADRESS_TABLE } from "../../entities/event-adress.entity";

export const {
    getById: getEventAdressById,
    getManyByIds: getEventAdressByIds,
    select: selectEventAdress,
    insert: insertEventAdress,
    update: updateEventAdress,
    delete: deleteEventAdress,
    deleteAll: deleteAllEventAdress,
    count: countEventAdress,
} = createRepository<EventAdressEntity>(EVENT_ADRESS_TABLE, 'id');

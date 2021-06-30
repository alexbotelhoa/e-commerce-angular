import { createRepository } from "../services/repository.service";
import { CarrerEntity, CARRER_TABLE } from "../../entities/carrer.entity";

export const {
    getById: getCarrerById,
    getManyByIds: getCarrersByIds,
    select: selectCarrer,
    insert: insertCarrer,
    update: updateCarrer,
    delete: deleteCarrer,
    deleteAll: deleteAllCarrers,
    count: countCarrers,
} = createRepository<CarrerEntity>(CARRER_TABLE, 'id');

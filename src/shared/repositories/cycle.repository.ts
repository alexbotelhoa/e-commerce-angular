import { createRepository } from "../services/repository.service";
import { CycleEntity, CYCLE_TABLE } from "../../entities/cycle.entity";
import { insert } from "../services/cycle.service"

export const {
    getById: getCycleById,
    getManyByIds: getCyclesByIds,
    select: selectCycle,
    update: updateCycle,
    delete: deleteCycle,
    deleteAll: deleteAllCycles,
} = createRepository<CycleEntity>(CYCLE_TABLE, 'id');

export const insertCycle = insert;
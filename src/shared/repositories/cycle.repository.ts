import { createRepository } from "../services/repository.service";
import { CycleEntity, CYCLE_TABLE } from "../../entities/cycle.entity";

export const {
    getById: getCycleById,
    getManyByIds: getCyclesByIds,
    select: selectCycle,
    insert: insertCycle,
    update: updateCycle,
    delete: deleteCycle,
    deleteAll: deleteAllCycles,
    count: countCycles,
} = createRepository<CycleEntity>(CYCLE_TABLE, 'id');

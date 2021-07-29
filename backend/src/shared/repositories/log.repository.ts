import { LogEntity, LOG_TABLE } from "../../entities/log.entity";
import { createRepository } from "../services/repository.service";

export const {
    getById: getLogById,
    getManyByIds: getLogsByIds,
    insert: insertLog,
    select: selectLog,
    update: updateLog,
    delete: deleteLog,
    deleteAll: deleteAllLogs,
    count: countLogs,
} = createRepository<LogEntity>(LOG_TABLE, 'id');

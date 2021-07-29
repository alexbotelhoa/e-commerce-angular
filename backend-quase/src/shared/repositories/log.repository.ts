import { createRepository } from "../services/repository.service";
import { LogEntity, LOG_TABLE } from "../../entities/log.entity";

export const {
    getById: getLogById,
    insert: insertLog,
    select: selectLog,
    update: updateLog,
    delete: deleteLog,
    deleteAll: deleteAllLogs,
} = createRepository<LogEntity>(LOG_TABLE, 'id');

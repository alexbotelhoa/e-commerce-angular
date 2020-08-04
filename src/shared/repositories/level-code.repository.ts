import { createRepository } from "../services/repository.service";
import { LevelCodeEntity, LEVEL_CODE_TABLE } from "../../entities/level-code.entity";

export const {
    getById: getLevelCodeById,
    getManyByIds: getLevelCodesByIds,
    insert: insertLevelCode,
    select: selectLevelCode,
    update: updateLevelCode,
    delete: deleteLevelCode,
    deleteAll: deleteAllLevelCodes,
} = createRepository<LevelCodeEntity>(LEVEL_CODE_TABLE, 'id');

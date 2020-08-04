import { createCompositePKRepository } from "../services/repository.service";
import { LevelLevelCodeEntity, LEVEL_LEVEL_CODE_TABLE } from "../../entities/level-level-code.entity";

export const {
    insert: insertLevelLevelCode,
    select: selectLevelLevelCode,
    update: updateLevelLevelCode,
    delete: deleteLevelLevelCode,
    deleteAll: deleteAllLevelLevelCodes,
} = createCompositePKRepository<LevelLevelCodeEntity, 'levelId' | 'levelCodeId'>(LEVEL_LEVEL_CODE_TABLE, ['levelId', 'levelCodeId']);

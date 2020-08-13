import { createRepository } from "../services/repository.service";
import { LevelEntity, LEVEL_TABLE } from "../../entities/level.entity";

export const {
    getById: getLevelById,
    getManyByIds: getLevelsByIds,
    insert: insertLevel,
    select: selectLevel,
    update: updateLevel,
    delete: deleteLevel,
    deleteAll: deleteAllLevels,
    count: countLevels,
} = createRepository<LevelEntity>(LEVEL_TABLE, 'id');

import { createRepository } from "../services/repository.service";
import { LevelEntity, LEVEL_TABLE } from "../../entities/level.entity";

export const {
    getById: getLevelById,
    select: selectLevel,
    insert: insertLevel,
    update: updateLevel,
    delete: deleteLevel,
    deleteAll: deleteAllLevels,
} = createRepository<LevelEntity>(LEVEL_TABLE, 'id');

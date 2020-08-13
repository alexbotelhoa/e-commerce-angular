import { createRepository } from "../services/repository.service";
import { LevelThemeEntity, LEVEL_THEME_TABLE } from "../../entities/level-theme.entity";

export const {
    getById: getLevelThemeById,
    getManyByIds: getLevelThemesByIds,
    select: selectLevelTheme,
    insert: insertLevelTheme,
    update: updateLevelTheme,
    delete: deleteLevelTheme,
    deleteAll: deleteAllLevelThemes,
    count: countLevelThemes,
} = createRepository<LevelThemeEntity>(LEVEL_THEME_TABLE, 'id');

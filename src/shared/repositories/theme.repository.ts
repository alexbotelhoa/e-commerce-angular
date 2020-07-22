import { createRepository } from "../services/repository.service";
import { ThemeEntity, THEME_TABLE } from "../../entities/theme.entity";

export const {
    getById: getThemeById,
    getManyByIds: getThemesByIds,
    select: selectTheme,
    insert: insertTheme,
    update: updateTheme,
    delete: deleteTheme,
    deleteAll: deleteAllThemes,
} = createRepository<ThemeEntity>(THEME_TABLE, 'id');

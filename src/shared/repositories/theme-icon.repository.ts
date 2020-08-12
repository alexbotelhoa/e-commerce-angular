import { createRepository } from "../services/repository.service";
import { ThemeIconEntity, THEME_ICON_TABLE } from "../../entities/themes/theme-icon.entity";

export const {
    getById: getThemeIconById,
    getManyByIds: getThemeIconsByIds,
    select: selectThemeIcon,
    insert: insertThemeIcon,
    update: updateThemeIcon,
    delete: deleteThemeIcon,
    deleteAll: deleteAllThemeIconsData,
} = createRepository<ThemeIconEntity>(THEME_ICON_TABLE, 'themeId');

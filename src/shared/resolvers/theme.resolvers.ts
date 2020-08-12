import { GQLThemeResolvers } from "../../resolvers-types";
import { ThemeEntity } from "../../entities/theme.entity";

export const themeEntityResolvers: Pick<GQLThemeResolvers, keyof ThemeEntity> = {
    id: obj => obj.id.toString(),
    active: obj => obj.active,
    name: obj => obj.name,
    startColor: obj => obj.startColor,
    endColor: obj => obj.endColor
}

import { ThemeIconEntity } from "../../entities/themes/theme-icon.entity";
import { DatabaseService } from "../../shared/services/database.service";
import { selectThemeIcon } from "../../shared/repositories/theme-icon.repository";
import { DatabaseLoaderFactory } from "../../shared/types/database-loader.type";
import { createDataloaderSingleSort } from "../../shared/utils/dataloader-single-sort";

const themeIconDataLoaderSorter = createDataloaderSingleSort<ThemeIconEntity, number, ThemeIconEntity>('themeId');

const themeIconDataLoaderFactory: DatabaseLoaderFactory<ThemeIconEntity['themeId'], ThemeIconEntity> =
    (db: DatabaseService) => ({
        batchFn: async ids => {
            const result = await selectThemeIcon(db).whereIn("themeId", ids);
            const sorter = themeIconDataLoaderSorter(ids);
            return sorter(result);
        },
    });

export const themeIconDataResolver: GQLThemeResolvers['icon'] = (obj, params, context) => {
    const dataLoader = context.getDatabaseLoader(themeIconDataLoaderFactory)
    return dataLoader.load(obj.id);
}


export const themeResolvers: GQLThemeResolvers = {
    ...themeEntityResolvers,
    icon: themeIconDataResolver
}

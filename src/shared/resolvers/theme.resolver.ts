import { GQLThemeResolvers } from "../../resolvers-types";
import { ThemeEntity } from "../../entities/theme.entity";

const themeEntityResolvers: Pick<GQLThemeResolvers, keyof ThemeEntity> = {
    id: obj => obj.id.toString(),
    active: obj => obj.active,
    name: obj => obj.name,
    startColor: obj => obj.startColor,
    endColor: obj => obj.endColor
}

import { ThemeIconEntity } from "../../entities/theme-icon.entity";
import { selectThemeIcon } from "../repositories/theme-icon.repository";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";

const themeIconDataLoaderSorter = createDataloaderSingleSort<ThemeIconEntity, number, ThemeIconEntity>('themeId');

const themeIconDataLoaderFactory: DatabaseLoaderFactory<ThemeIconEntity['themeId'], ThemeIconEntity> = {
    id: 'themeIconDataLoaderFactory',
    batchFn: db => async ids => {
        const result = await selectThemeIcon(db).whereIn("themeId", ids);
        const sorter = themeIconDataLoaderSorter(ids);
        return sorter(result);
    },
};

export const themeIconDataResolver: GQLThemeResolvers['icon'] = async (obj, params, context) => {
    return await context.getDatabaseLoader(themeIconDataLoaderFactory, undefined).load(obj.id)
}

export const themeResolvers: GQLThemeResolvers = {
    ...themeEntityResolvers,
    icon: themeIconDataResolver
}
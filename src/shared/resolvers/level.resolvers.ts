import { GQLResolvers, GQLLevelResolvers } from "../../resolvers-types"

import { LevelThemeEntity } from "../../entities/level-theme.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectLevelTheme } from "../repositories/level-theme.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";

import { LevelEntity } from "../../entities/level.entity";

import { extract } from "../utils/prop-extract"

const levelEntityResolvers: Pick<GQLLevelResolvers, keyof LevelEntity> = {
    id: extract('id', String),
    name: extract('name'),
    order: extract('order'),
    active: extract('active')
}

const levelThemesSorter = createDataloaderMultiSort<LevelThemeEntity, number>('levelId');

const levelThemesDataloader: DatabaseLoaderFactory<number, LevelThemeEntity[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectLevelTheme(db).whereIn('levelId', ids);
        const sortedEntities = levelThemesSorter(ids)(entities);
        return sortedEntities;
    }
})

export const levelThemesResolver: GQLLevelResolvers['levelThemes'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(levelThemesDataloader),
        levelThemes = await dataloader.load(obj.id);

    return levelThemes;
}

export const levelResolvers: GQLResolvers['Level'] = {
    ...levelEntityResolvers,
    levelThemes: levelThemesResolver,
}



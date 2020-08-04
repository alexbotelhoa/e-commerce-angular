import { GQLLevelResolvers } from "../../resolvers-types"

import { LevelThemeEntity } from "../../entities/level-theme.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectLevelTheme } from "../repositories/level-theme.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";

import { LevelEntity } from "../../entities/level.entity";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { selectLevelLevelCode } from "../repositories/level-level-code.repository";
import { LevelLevelCodeEntity } from "../../entities/level-level-code.entity";
import { selectLevelCode } from "../repositories/level-code.repository";

const levelEntityResolvers: Pick<GQLLevelResolvers, keyof LevelEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    order: obj => obj.order,
    active: obj => obj.active
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

const levelCodesSorter = createDataloaderMultiSort<LevelLevelCodeEntity, number>('levelId');

const levelCodesDataloader: DatabaseLoaderFactory<number, LevelCodeEntity[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectLevelLevelCode(db).whereIn('levelId', ids);
        const codeIds = entities.map(entity => entity.levelCodeId);
        // we'll probably have a lot of duplicate ids, so we need to remove those to avoid passing too many redundant parameters to the next query
        const setCodeIds = new Set(codeIds);
        const uniqueCodeIds = Array.from(setCodeIds);
        const codes = await selectLevelCode(db).whereIn('id', uniqueCodeIds);
        // generate a map to optimize lookup time of LevelCode entities
        const codesById = codes.reduce<Record<string, LevelCodeEntity>>((acc, code) => {
            acc[code.id] = code;
            return acc;
        }, {});
        // sort by the levelId
        const sortedEntities = levelCodesSorter(ids)(entities);
        // iterate through each array and replace the LevelLevelCode by the respective LevelCode entity
        const sortedEntitiesWithCodes = sortedEntities.map(levelLevelCodes => {
            return levelLevelCodes.map(levelLevelCode => codesById[levelLevelCode.levelCodeId]);
        });
        return sortedEntitiesWithCodes;
    }
})

const levelCodesResolver: GQLLevelResolvers['codes'] = async (obj, params, context) => {
    return context.getDatabaseLoader(levelCodesDataloader).load(obj.id)
}

export const levelResolvers: GQLLevelResolvers = {
    ...levelEntityResolvers,
    levelThemes: levelThemesResolver,
    codes: levelCodesResolver,
}



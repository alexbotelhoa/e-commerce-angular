import { GQLLevelResolvers } from "../../resolvers-types"

import { LevelThemeEntity } from "../../entities/level-theme.entity"
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";

import { selectLevelTheme } from "../repositories/level-theme.repository"

import { DatabaseLoaderFactory } from "../types/database-loader.type";

import { LevelEntity } from "../../entities/level.entity";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { selectLevelCode } from "../repositories/level-code.repository";

const levelEntityResolvers: Pick<GQLLevelResolvers, keyof LevelEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    description: obj => obj.description,
    order: obj => obj.order,
    active: obj => obj.active,
    typeId: obj => obj.typeId,
}

const levelThemesSorter = createDataloaderMultiSort<LevelThemeEntity, number>('levelId');

const levelThemesDataloader: DatabaseLoaderFactory<number, LevelThemeEntity[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectLevelTheme(db).whereIn('levelId', ids).orderBy('order', 'asc');
        const sortedEntities = levelThemesSorter(ids)(entities);
        return sortedEntities;
    }
})

export const levelThemesResolver: GQLLevelResolvers['levelThemes'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(levelThemesDataloader),
        levelThemes = await dataloader.load(obj.id);

    return levelThemes;
}

const levelCodesSorter = createDataloaderMultiSort<LevelCodeEntity, number>('levelId');

const levelCodesDataloader: DatabaseLoaderFactory<number, LevelCodeEntity[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectLevelCode(db).whereIn('levelId', ids);
        const sortedEntities = levelCodesSorter(ids)(entities);
        return sortedEntities;
    }
})

const levelCodesResolver: GQLLevelResolvers['codes'] = async (obj, params, context) => {
    return context.getDatabaseLoader(levelCodesDataloader).load(obj.id)
}

const levelViewerClassesFieldResolver: GQLLevelResolvers['viewerClasses'] = async (obj, params, context) => {
    return [
        {
            classId: 1,
            enrollmentId: 1,
            id: 1,
        }
    ];
}

const levelTotalActivitiesFieldResolver: GQLLevelResolvers['totalActivities'] = async (obj, params, context) => {
    return 20;
}

const levelViewerTotalCompletedActivitiesFieldResolver: GQLLevelResolvers['viewerTotalCompletedActivities'] = async (obj, params, context) => {
    return 10;
}

const levelViewerNextUnfinishedActivityFieldResolver: GQLLevelResolvers['viewerNextUnfinishedActivity'] = async (obj, params, context) => {
    return {
        activityId: 1,
        cycleId: 1,
        id: 1,
        order: 1,
    };
}

export const levelResolvers: GQLLevelResolvers = {
    ...levelEntityResolvers,
    levelThemes: levelThemesResolver,
    codes: levelCodesResolver,
    viewerClasses: levelViewerClassesFieldResolver,
    totalActivities: levelTotalActivitiesFieldResolver,
    viewerTotalCompletedActivities: levelViewerTotalCompletedActivitiesFieldResolver,
    viewerNextUnfinishedActivity: levelViewerNextUnfinishedActivityFieldResolver,
}



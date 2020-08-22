import { GQLLevelCodeResolvers } from "../../resolvers-types";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { LevelEntity } from "../../entities/level.entity";
import { getLevelsByIds } from "../repositories/level.repository";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";

const levelCodeEntityResolvers: Pick<GQLLevelCodeResolvers, keyof LevelCodeEntity> = {
    id: obj => obj.id.toString(10),
    active: obj => obj.active,
    createdAt: obj => obj.createdAt,
    code: obj => obj.code,
    description: obj => obj.description,
    levelId: obj => obj.levelId
        ? obj.levelId.toString(10)
        : null,
}

const levelCodeLevelByIdSorter = createDataloaderSingleSort<LevelEntity, number, LevelEntity>('id');


const levelCodeLevelByIdDataLoader: DatabaseLoaderFactory<number, LevelEntity, LevelEntity | undefined> = {
    id: 'levelCodeLevelByIdDataLoader',
    batchFn: db => async (ids) => {
        const entities = await getLevelsByIds(db)(ids);
        const sortedEntities = levelCodeLevelByIdSorter(ids)(entities);
        return sortedEntities;
    }
}


export const levelCodeLevelFieldResolver: GQLLevelCodeResolvers['level'] = async (obj, params, context) => {
    if (obj.levelId === null) {
        return null;
    }
    return context.getDatabaseLoader(levelCodeLevelByIdDataLoader, undefined).load(obj.levelId);
}

export const levelCodeResolvers: GQLLevelCodeResolvers = {
    ...levelCodeEntityResolvers,
    level: levelCodeLevelFieldResolver,
}

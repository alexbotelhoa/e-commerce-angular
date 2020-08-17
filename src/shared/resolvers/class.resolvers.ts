import { ClassEntity } from "../../entities/class.entity";
import { GQLClassResolvers } from "../../resolvers-types";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelCodesByIds } from "../repositories/level-code.repository";

export const classEntityResolvers: Pick<GQLClassResolvers, keyof ClassEntity> = {
    id: obj => obj.id.toString(10),
    levelCodeId: obj => obj.levelCodeId.toString(10),
    name: obj => obj.name,
}

const classLevelCodeSorter = createDataloaderSingleSort<LevelCodeEntity, number, LevelCodeEntity>('id');


const classLevelCodeDataloader: DatabaseLoaderFactory<number, LevelCodeEntity> = (db) => ({
    batchFn: async (ids) => {
        const entities = await getLevelCodesByIds(db)(ids);
        const sortedEntities = classLevelCodeSorter(ids)(entities);
        return sortedEntities;
    }
})

export const classLevelCodeResolver: GQLClassResolvers['levelCode'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(classLevelCodeDataloader);
    const levelCodes = await dataloader.load(obj.levelCodeId);
    return levelCodes;
}

export const classResolvers: GQLClassResolvers = {
    ...classEntityResolvers,
    levelCode: classLevelCodeResolver,
}

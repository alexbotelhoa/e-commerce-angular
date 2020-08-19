import { GQLEnrollmentResolvers } from "../../resolvers-types";
import { EnrollmentEntity } from "../../entities/enrollment.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { getLevelCodesByIds } from "../repositories/level-code.repository";
import { LevelCodeEntity } from "../../entities/level-code.entity";

export const enrollmentEntityResolvers: Pick<GQLEnrollmentResolvers, keyof EnrollmentEntity> = {
    id: obj => obj.id.toString(10),
    levelCodeId: obj => obj.levelCodeId.toString(10),
    userId: obj => obj.userId.toString(10),
}

const enrollmentLevelCodeByIdSorter = createDataloaderSingleSort<LevelCodeEntity, number, LevelCodeEntity>('id');

const enrollmentLevelCodeByIdDataLoader: DatabaseLoaderFactory<number, LevelCodeEntity> = (db) => {
    return {
        batchFn: async (ids) => {
            const levelCodes = await getLevelCodesByIds(db)(ids);
            const sortedClasses = enrollmentLevelCodeByIdSorter(ids)(levelCodes);
            return sortedClasses;
        }
    }
}

export const enrollmentClassFieldResolver: GQLEnrollmentResolvers['levelCode'] = (obj, params, context) => {
    return context.getDatabaseLoader(enrollmentLevelCodeByIdDataLoader).load(obj.levelCodeId);
}

export const enrollmentResolvers: GQLEnrollmentResolvers = {
    ...enrollmentEntityResolvers,
    levelCode: enrollmentClassFieldResolver,
}

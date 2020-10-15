import { GQLEnrollmentResolvers } from "../../resolvers-types";
import { EnrollmentEntity } from "../../entities/enrollment.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { getLevelCodesByIds } from "../repositories/level-code.repository";
import { LevelCodeEntity } from "../../entities/level-code.entity";

export const enrollmentEntityResolvers: Pick<GQLEnrollmentResolvers, keyof EnrollmentEntity> = {
    id: obj => obj.id.toString(10),
    levelCodeId: obj => obj.levelCodeId.toString(10),
    userId: obj => obj.userId,
}

const enrollmentLevelCodeByIdSorter = createDataloaderSingleSort<LevelCodeEntity, number, LevelCodeEntity>('id');

const enrollmentLevelCodeByIdDataLoader: DatabaseLoaderFactory<number, LevelCodeEntity> = {
    id: 'enrollmentLevelCodeByIdDataLoader',
    batchFn: db => async (ids) => {
        const levelCodes = await getLevelCodesByIds(db)(ids);
        const sortedClasses = enrollmentLevelCodeByIdSorter(ids)(levelCodes);
        return sortedClasses;
    }
}

export const enrollmentClassFieldResolver: GQLEnrollmentResolvers['levelCode'] = (obj, params, context) => {
    return context.getDatabaseLoader(enrollmentLevelCodeByIdDataLoader, undefined).load(obj.levelCodeId);
}

export const enrollmentResolvers: GQLEnrollmentResolvers = {
    ...enrollmentEntityResolvers,
    levelCode: enrollmentClassFieldResolver,
}

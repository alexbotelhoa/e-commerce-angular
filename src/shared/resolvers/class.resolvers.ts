import { ClassEntity } from "../../entities/class.entity";
import { GQLClassResolvers } from "../../resolvers-types";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { getLevelCodesByIds } from "../repositories/level-code.repository";
import { classStudentGradesFieldResolver } from "../../domain/activity/resolvers/class/class-student-grades.type.resolver";

export const classEntityResolvers: Pick<GQLClassResolvers, keyof ClassEntity> = {
    id: obj => obj.id,
    levelCodeId: obj => obj.levelCodeId.toString(10),
    name: obj => obj.name,
    carrerId: obj => obj.carrerId,
    institutionId: obj => obj.institutionId,
    periodId: obj => obj.periodId,
    sessionId: obj => obj.sessionId,
    endDate: obj => obj.endDate,
    startDate: obj => obj.startDate,
    localId: obj => obj.localId,
    campusId: obj => obj.campusId,
    regionalId: obj => obj.regionalId,
}

const classLevelCodeSorter = createDataloaderSingleSort<LevelCodeEntity, number, LevelCodeEntity>('id');


const classLevelCodeDataloader: DatabaseLoaderFactory<number, LevelCodeEntity> = {
    id: 'classLevelCodeDataloader',
    batchFn: db => async (ids) => {
        const entities = await getLevelCodesByIds(db)(ids);
        const sortedEntities = classLevelCodeSorter(ids)(entities);
        return sortedEntities;
    }
}

export const classLevelCodeResolver: GQLClassResolvers['levelCode'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(classLevelCodeDataloader, undefined);
    const levelCodes = await dataloader.load(obj.levelCodeId);
    return levelCodes;
}

export const classResolvers: GQLClassResolvers = {
    ...classEntityResolvers,

    levelCode: classLevelCodeResolver,
    studentGrades: classStudentGradesFieldResolver,
}

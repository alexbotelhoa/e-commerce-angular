import { ClassEntity } from "../../entities/class.entity";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { GQLClassResolvers, GQLClassStatus } from "../../resolvers-types";
import { getLevelCodesByIds } from "../repositories/level-code.repository";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { classStudentGradesFieldResolver } from "../../domain/activity/resolvers/class/class-student-grades.type.resolver";

const classEntityResolvers: Pick<GQLClassResolvers, keyof ClassEntity> = {
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
    hasEcampus: obj => obj.hasEcampus,
    hasEyoung: obj => obj.hasEyoung,
    hasActivated: obj => obj.hasActivated,
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

export const classStatusResolver: GQLClassResolvers['status'] = async (obj) => {
    const now = new Date();
    now.setHours(0,0,0,0);

    const classStartDate = new Date(obj.startDate || '');
    classStartDate.setDate(classStartDate.getDate() - 30);

    const classEndDate = new Date(obj.endDate || '');
    classEndDate.setDate(classEndDate.getDate() + 29);

    const isNotInitial = now < classStartDate ? GQLClassStatus.NOT_STARTED : null;
    const isActive = now >= classStartDate && now <= classEndDate ? GQLClassStatus.ACTIVE : null;
    const isFinished = now > classEndDate ? GQLClassStatus.FINISHED : null;

    return [
        isNotInitial,
        isActive,
        isFinished,
    ].find(status => !!status) as GQLClassStatus;
}

export const classResolvers: GQLClassResolvers = {
    ...classEntityResolvers,
    levelCode: classLevelCodeResolver,
    studentGrades: classStudentGradesFieldResolver,
    status: classStatusResolver
}

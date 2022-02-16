import { GQLLevelCodeResolvers, GQLLevelCodeViewClassFilterInput, GQLLevelCodeViewTeacherClassFilterInput } from "../../resolvers-types";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { LevelEntity } from "../../entities/level.entity";
import { getLevelsByIds } from "../repositories/level.repository";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { TEACHER_CLASS_TABLE, TeacherClassEntity } from "../../entities/teacher-class.entity";
import { CLASS_TABLE, ClassEntity } from "../../entities/class.entity";
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";
import { ENROLLMENT_TABLE } from "../../entities/enrollment.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../entities/enrollment-class.entity";

const levelCodeEntityResolvers: Pick<GQLLevelCodeResolvers, keyof LevelCodeEntity> = {
    id: obj => obj.id.toString(10),
    active: obj => obj.active,
    createdAt: obj => obj.createdAt,
    code: obj => obj.code,
    description: obj => obj.description,
    levelId: obj => obj.levelId
    ? obj.levelId.toString(10)
    : null,
    learningMore: obj => obj.learningMore,
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

type TeacherClassWithLevelCodeId = TeacherClassEntity & Pick<ClassEntity, 'levelCodeId'>;

type ClassWithLevelCodeId = ClassEntity;

const levelCodeViewerTeacherClassesByLevelCodeIdSorter = createDataloaderMultiSort<TeacherClassWithLevelCodeId, number>('levelCodeId');

const levelCodeViewerClassesByLevelCodeIdSorter = createDataloaderMultiSort<ClassWithLevelCodeId, number>('levelCodeId');

interface LevelCodeViewTeacherClassFilterInput {
    userId: string;
    filters: GQLLevelCodeViewTeacherClassFilterInput | null | undefined
}

interface LevelCodeViewClassFilterInput {
    userId: string;
    filters: GQLLevelCodeViewClassFilterInput | null | undefined
}

export const levelCodeViewerTeacherClassesByLevelCodeIdLoader: DatabaseLoaderFactory<number, TeacherClassEntity[], TeacherClassEntity[], LevelCodeViewTeacherClassFilterInput> = {
    id: 'levelCodeViewerTeacherClassesByLevelCodeId',
    batchFn: (db, params) => async (ids) => {
        const query = db.select([`${TEACHER_CLASS_TABLE}.*`, `${CLASS_TABLE}.levelCodeId`])
            .from(TEACHER_CLASS_TABLE)
            .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${TEACHER_CLASS_TABLE}.classId`)
            .andWhere(`${TEACHER_CLASS_TABLE}.teacherId`, params.userId)
            .whereIn(`${CLASS_TABLE}.levelCodeId`, ids);

        if (params.filters?.active) {
            query.andWhere(`${CLASS_TABLE}.endDate`, '>=', db.raw('DATE_ADD(CURRENT_DATE(), INTERVAL - 30 DAY)'));
        }

        const entities: TeacherClassWithLevelCodeId[] = await query;
        const sorted = levelCodeViewerTeacherClassesByLevelCodeIdSorter(ids)(entities);
        return sorted;
    }
}

export const levelCodeClassesByLevelCodeIdLoader: DatabaseLoaderFactory<number, ClassEntity[], ClassEntity[], LevelCodeViewClassFilterInput> = {
    id: 'levelCodeClassesByLevelCodeIdLoader',
    batchFn: (db, params) => async (ids) => {

        const query = db
            .select(`${CLASS_TABLE}.*`)
            .from(ENROLLMENT_TABLE)
            .innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.id`)
            .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${ENROLLMENT_CLASS_TABLE}.classId`)
            .whereIn(`${CLASS_TABLE}.levelCodeId`, ids)

        if (params.filters?.userId) {
            query.andWhere(`${ENROLLMENT_TABLE}.userId`, '=', params.filters.userId);
        }

        if (params.filters?.last30days) {
            query.andWhere(`${CLASS_TABLE}.endDate`, '>=', db.raw('DATE_ADD(CURRENT_DATE(), INTERVAL - 30 DAY)'));
        }

        const entities: ClassWithLevelCodeId[] = await query;
        const sorted = levelCodeViewerClassesByLevelCodeIdSorter(ids)(entities);
        return sorted;
    }
}

export const levelCodeViewerTeacherClassesResolver: GQLLevelCodeResolvers['viewerTeacherClasses'] = async (obj, params, context) => {
    const user = context.currentUser;
    const filters = params.filters;
    if (!user) {
        return [];
    }

    return context.getDatabaseLoader(levelCodeViewerTeacherClassesByLevelCodeIdLoader, { userId: user.id, filters: filters }).load(obj.id);
}

export const levelCodeViewerClassesResolver: GQLLevelCodeResolvers['viewerClasses'] = async (obj, params, context) => {
    const user = context.currentUser;
    const filters = params.filters;
    if (!user) {
        return [];
    }
    const levelCodeId = obj.id;

    return context.getDatabaseLoader(levelCodeClassesByLevelCodeIdLoader, { userId: user.id, filters: filters }).load(obj.id);
}

export const levelCodeResolvers: GQLLevelCodeResolvers = {
    ...levelCodeEntityResolvers,
    level: levelCodeLevelFieldResolver,
    viewerTeacherClasses: levelCodeViewerTeacherClassesResolver,
    viewerClasses: levelCodeViewerClassesResolver,
}

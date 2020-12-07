import { GQLLevelCodeResolvers, GQLLevelCodeViewTeacherClassFilterInput } from "../../resolvers-types";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { LevelEntity } from "../../entities/level.entity";
import { getLevelsByIds } from "../repositories/level.repository";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { TEACHER_CLASS_TABLE, TeacherClassEntity } from "../../entities/teacher-class.entity";
import { CLASS_TABLE, ClassEntity } from "../../entities/class.entity";
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";
import { format } from "date-fns";

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

type TeacherClassWithLevelCodeId = TeacherClassEntity & Pick<ClassEntity, 'levelCodeId'>;

const levelCodeViewerTeacherClassesByLevelCodeIdSorter = createDataloaderMultiSort<TeacherClassWithLevelCodeId, number>('levelCodeId');

interface LevelCodeViewTeacherClassFilterInput {
    userId: string;
    filters: GQLLevelCodeViewTeacherClassFilterInput | null | undefined
}

export const levelCodeViewerTeacherClassesByLevelCodeIdLoader: DatabaseLoaderFactory<number, TeacherClassEntity[], TeacherClassEntity[], LevelCodeViewTeacherClassFilterInput> = {
    id: 'levelCodeViewerTeacherClassesByLevelCodeId',
    batchFn: (db, params) => async (ids) => {
        const query = db
            .select([`${TEACHER_CLASS_TABLE}.*`, `${CLASS_TABLE}.levelCodeId`])
            .from(TEACHER_CLASS_TABLE)
            .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${TEACHER_CLASS_TABLE}.classId`)
            .andWhere(`${TEACHER_CLASS_TABLE}.teacherId`, params.userId)
            .whereIn(`${CLASS_TABLE}.levelCodeId`, ids)
            ;

        if (!!params.filters?.active) {
            const endDate = new Date();
            const endDateFormated = format(endDate, 'yyyy-MM-dd');
            query.andWhere(`${CLASS_TABLE}.endDate`, '>=', endDateFormated)
        }

        const entities: TeacherClassWithLevelCodeId[] = await query;
        const sorted = levelCodeViewerTeacherClassesByLevelCodeIdSorter(ids)(entities);
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

export const levelCodeResolvers: GQLLevelCodeResolvers = {
    ...levelCodeEntityResolvers,
    level: levelCodeLevelFieldResolver,
    viewerTeacherClasses: levelCodeViewerTeacherClassesResolver,
}

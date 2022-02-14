import { ClassEntity } from "../../entities/class.entity";
import { getUserById } from "../repositories/user.repository";
import { GQLTeacherClassResolvers } from "../../resolvers-types";
import { getClassesByIds } from "../repositories/class.repository";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { TeacherClassEntity } from "../../entities/teacher-class.entity";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";

const teacherClassEntityResolvers: Pick<GQLTeacherClassResolvers, keyof TeacherClassEntity> = {
    id: obj => obj.id.toString(10),
    classId: obj => obj.classId,
    teacherId: obj => obj.teacherId,
}

const teacherClassClassByClassIdSorter = createDataloaderSingleSort<ClassEntity, string, ClassEntity>('id');

export const teacherClassClassByClassIdLoader: DatabaseLoaderFactory<string, ClassEntity, ClassEntity> = {
    id: 'teacherClassClassByClassIdLoader',
    batchFn: (db) => async (ids) => {
        const entities = await getClassesByIds(db)(ids);
        const sorted = teacherClassClassByClassIdSorter(ids)(entities);
        return sorted;
    }
}

export const teacherClassClassesFieldResolver: GQLTeacherClassResolvers['class'] = async (obj, params, context) => {
    return context.getDatabaseLoader(teacherClassClassByClassIdLoader, undefined).load(obj.classId);
};

const teacherClassTeacherFieldResolver: GQLTeacherClassResolvers['teacher'] = async (obj, params, { database: db }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getUserById(db)(obj.teacherId))!;
};

export const teacherClassResolvers: GQLTeacherClassResolvers = {
    ...teacherClassEntityResolvers,
    teacher: teacherClassTeacherFieldResolver,
    class: teacherClassClassesFieldResolver
}

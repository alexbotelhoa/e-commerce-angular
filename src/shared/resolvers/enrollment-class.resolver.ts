import { GQLEnrollmentClassResolvers } from "../../resolvers-types";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { EnrollmentClassEntity } from "../../entities/enrollment-class.entity";
import { getClassesByIds } from "../repositories/class.repository";
import { ClassEntity } from "../../entities/class.entity";

export const enrollmentClassEntityResolvers: Pick<GQLEnrollmentClassResolvers, keyof EnrollmentClassEntity> = {
    id: obj => obj.id.toString(10),
    classId: obj => obj.classId.toString(10),
    enrollmentId: obj => obj.enrollmentId.toString(10),
}

const enrollmentClassClassByIdSorter = createDataloaderSingleSort<ClassEntity, number, ClassEntity>('id');

const enrollmentClassClassByIdDataLoader: DatabaseLoaderFactory<number, ClassEntity> = (db) => {
    return {
        batchFn: async (ids) => {
            const classes = await getClassesByIds(db)(ids);
            const sortedClasses = enrollmentClassClassByIdSorter(ids)(classes);
            return sortedClasses;
        }
    }
}

export const enrollmentClassFieldResolver: GQLEnrollmentClassResolvers['class'] = (obj, params, context) => {
    return context.getDatabaseLoader(enrollmentClassClassByIdDataLoader).load(obj.classId);
}

export const enrollmentClassResolvers: GQLEnrollmentClassResolvers = {
    ...enrollmentClassEntityResolvers,
    class: enrollmentClassFieldResolver,
}

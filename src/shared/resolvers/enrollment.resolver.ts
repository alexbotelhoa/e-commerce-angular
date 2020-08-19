import { GQLEnrollmentResolvers } from "../../resolvers-types";
import { EnrollmentEntity } from "../../entities/enrollment.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { ClassEntity } from "../../entities/class.entity";
import { getClassesByIds } from "../repositories/class.repository";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";

export const enrollmentEntityResolvers: Pick<GQLEnrollmentResolvers, keyof EnrollmentEntity> = {
    id: obj => obj.id.toString(10),
    classId: obj => obj.classId.toString(10),
    userId: obj => obj.userId.toString(10),
}

const enrollmentClassByIdSorter = createDataloaderSingleSort<ClassEntity, number, ClassEntity>('id');

const enrollmentClassByIdDataLoader: DatabaseLoaderFactory<number, ClassEntity> = (db) => {
    return {
        batchFn: async (ids) => {
            const classes = await getClassesByIds(db)(ids);
            const sortedClasses = enrollmentClassByIdSorter(ids)(classes);
            return sortedClasses;
        }
    }
}

export const enrollmentClassResolver: GQLEnrollmentResolvers['class'] = (obj, params, context) => {
    return context.getDatabaseLoader(enrollmentClassByIdDataLoader).load(obj.classId);
}

export const enrollmentResolvers: GQLEnrollmentResolvers = {
    ...enrollmentEntityResolvers,
    class: enrollmentClassResolver,
}

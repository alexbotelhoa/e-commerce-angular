import { GQLEnrollmentClassResolvers } from "../../resolvers-types";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { EnrollmentClassEntity } from "../../entities/enrollment-class.entity";
import { getClassesByIds } from "../repositories/class.repository";
import { ClassEntity } from "../../entities/class.entity";

export const enrollmentClassEntityResolvers: Pick<GQLEnrollmentClassResolvers, keyof EnrollmentClassEntity> = {
    id: obj => obj.id.toString(10),
    classId: obj => obj.classId,
    enrollmentId: obj => obj.enrollmentId.toString(10),
}

const enrollmentClassClassByIdSorter = createDataloaderSingleSort<ClassEntity, string, ClassEntity>('id');

const enrollmentClassClassByIdDataLoader: DatabaseLoaderFactory<string, ClassEntity> = {
    id: 'enrollmentClassClassByIdDataLoader',
    batchFn: db => async (ids) => {
        const classes = await getClassesByIds(db)(ids);
        const sortedClasses = enrollmentClassClassByIdSorter(ids)(classes);
        const now = new Date().getTime()
        const validClasses = sortedClasses.filter(item => {
            if (item.startDate instanceof Date) {
                return item.startDate.getTime() <= now;
            }
            return false;
        })
        const invalidClasses = sortedClasses.filter(item => {
            if (item.startDate instanceof Date) {
                return item.startDate.getTime() > now;
            }
            return false;
        })
        const sortedActiveClasses = validClasses.sort((a, b) => {
            let endDateA = a.endDate
            let endDateB = b.endDate
            endDateA = endDateA instanceof Date && endDateA ? endDateA : endDateA
            endDateB = endDateB instanceof Date && endDateB ? endDateB : endDateB
            if (endDateA instanceof Date && endDateB instanceof Date) {
                return endDateA.getTime() < endDateB.getTime() ? 1 : -1;
            } else if (endDateA && endDateB) {
                return new Date(endDateA).getTime() > new Date(endDateB).getTime() ? 1 : -1;
            } else {
                return -1
            }
        });
        return [...sortedActiveClasses, ...invalidClasses];
    }
}

export const enrollmentClassFieldResolver: GQLEnrollmentClassResolvers['class'] = (obj, params, context) => {
    return context.getDatabaseLoader(enrollmentClassClassByIdDataLoader, undefined).load(obj.classId);
}

export const enrollmentClassResolvers: GQLEnrollmentClassResolvers = {
    ...enrollmentClassEntityResolvers,
    class: enrollmentClassFieldResolver,
}

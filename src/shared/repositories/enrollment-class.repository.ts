import { createRepository } from "../services/repository.service";
import { ENROLLMENT_CLASS_TABLE, EnrollmentClassEntity } from "../../entities/enrollment-class.entity";

export const {
    getById: getEnrollmentClassById,
    getManyByIds: getEnrollmentClassesByIds,
    select: selectEnrollmentClass,
    insert: insertEnrollmentClass,
    update: updateEnrollmentClass,
    delete: deleteEnrollmentClass,
    deleteAll: deleteAllEnrollmentClasses,
    count: countEnrollmentClasses,
} = createRepository<EnrollmentClassEntity>(ENROLLMENT_CLASS_TABLE, 'id');

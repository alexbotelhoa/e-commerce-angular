import { createRepository } from "../services/repository.service";
import { EnrollmentEntity, ENROLLMENT_TABLE } from "../../entities/enrollment.entity";

export const {
    getById: getEnrollmentById,
    getManyByIds: getEnrollmentsByIds,
    select: selectEnrollment,
    insert: insertEnrollment,
    update: updateEnrollment,
    delete: deleteEnrollment,
    deleteAll: deleteAllEnrollments,
} = createRepository<EnrollmentEntity>(ENROLLMENT_TABLE, 'id');

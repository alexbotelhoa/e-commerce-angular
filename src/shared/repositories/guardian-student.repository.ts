import { createCompositePKRepository } from "../services/repository.service";
import { GuardianStudentEntity, GUARDIAN_STUDENT_TABLE } from "../../entities/guardian-student.entity";

export const {
    select: selectGuardianStudent,
    insert: insertGuardianStudent,
    update: updateGuardianStudent,
    delete: deleteGuardianStudent,
    deleteAll: deleteAllGuardianStudents,
    count: countGuardianStudents,
} = createCompositePKRepository<GuardianStudentEntity, 'guardianId' | 'studentId'>(GUARDIAN_STUDENT_TABLE, ['guardianId', 'studentId']);

import { createRepository } from "../services/repository.service";
import { TeacherClassEntity, TEACHER_CLASS_TABLE } from "../../entities/teacher-class.entity";

export const {
    getById: getTeacherClassById,
    getManyByIds: getTeacherClassesByIds,
    select: selectTeacherClass,
    insert: insertTeacherClass,
    update: updateTeacherClass,
    delete: deleteTeacherClass,
    deleteAll: deleteAllTeacherClasses,
    count: countTeacherClasses,
} = createRepository<TeacherClassEntity>(TEACHER_CLASS_TABLE, 'id');

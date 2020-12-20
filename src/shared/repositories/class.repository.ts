import { createRepository } from "../services/repository.service";
import { ClassEntity, CLASS_TABLE } from "../../entities/class.entity";

export const {
    getById: getClassById,
    getManyByIds: getClassesByIds,
    select: selectClass,
    insert: insertClass,
    update: updateClass,
    delete: deleteClass,
    deleteAll: deleteAllClasses,
    count: countClasses,
} = createRepository<ClassEntity>(CLASS_TABLE, 'id');

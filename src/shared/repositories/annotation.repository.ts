import { createRepository } from "../services/repository.service";
import { AnnotationEntity, ANNOTATION_TABLE } from "../../entities/annotation.entity";

export const {
    getById: getAnnotationById,
    getManyByIds: getActivitiesByIds,
    select: selectAnnotation,
    insert: insertAnnotation,
    update: updateAnnotation,
    delete: deleteAnnotation,
    deleteAll: deleteAllActivities,
    count: countActivities,
} = createRepository<AnnotationEntity>(ANNOTATION_TABLE, 'id');

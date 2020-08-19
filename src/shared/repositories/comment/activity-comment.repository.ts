import { createRepository } from "../../services/repository.service";
import { ActivityCommentEntity, ACTIVITY_COMMENT_TABLE } from "../../../entities/comments/activity-comment.entity";

export const {
    getById: getActivityCommentById,
    getManyByIds: getActivityCommentsByIds,
    select: selectActivityComment,
    insert: insertActivityComment,
    update: updateActivityComment,
    delete: deleteActivityComment,
    deleteAll: deleteAllActivityComments,
    count: countActivityComments,
} = createRepository<ActivityCommentEntity>(ACTIVITY_COMMENT_TABLE, 'id');

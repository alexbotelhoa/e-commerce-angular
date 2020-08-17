import { GQLActivityCommentResolvers } from "../../resolvers-types";
import { ActivityCommentEntity } from "../../entities/comments/activity-comment.entity";

export const activityCommentEntityResolvers: Pick<GQLActivityCommentResolvers, keyof ActivityCommentEntity> = {
    activityId: obj => obj.activityId.toString(10),
    classId: obj => obj.classId.toString(10),
    commentId: obj => obj.commentId.toString(10),
}

export const activityCommentResolvers: GQLActivityCommentResolvers = {
    ...activityCommentEntityResolvers,
}

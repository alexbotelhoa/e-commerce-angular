import { GQLActivityCommentResolvers } from "../../resolvers-types";
import { ActivityCommentEntity } from "../../entities/comments/activity-comment.entity";

export const activityCommentEntityResolvers: Pick<GQLActivityCommentResolvers, keyof ActivityCommentEntity> = {
    id: obj => obj.id.toString(10),
    activityId: obj => obj.activityId.toString(10),
    classId: obj => obj.classId.toString(10),
    text: obj => obj.text,
    parentId: obj => obj.parentId ? obj.parentId.toString(10) : null,
    userId: obj => obj.userId.toString(10),
}

export const activityCommentResolvers: GQLActivityCommentResolvers = {
    ...activityCommentEntityResolvers,
}

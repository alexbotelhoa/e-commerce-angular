import { GQLCommentResolvers } from "../../resolvers-types";
import { CommentEntity } from "../../entities/comments/comment.entity";

export const commentEntityResolvers: Pick<GQLCommentResolvers, keyof CommentEntity> = {
    id: obj => obj.id.toString(10),
    text: obj => obj.text,
    parentId: obj => obj.parentId ? obj.parentId.toString(10) : null,
    userId: obj => obj.userId.toString(10),
}

export const commentResolvers: GQLCommentResolvers = {
    ...commentEntityResolvers,
}
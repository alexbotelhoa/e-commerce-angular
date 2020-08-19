import { CommentEntity } from "./comment.interface";

export interface ActivityCommentEntity extends CommentEntity {
    id: number;
    activityId: number;
    classId: number;
}

export const ACTIVITY_COMMENT_TABLE = 'activity_comment';

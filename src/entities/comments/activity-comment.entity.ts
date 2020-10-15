import { CommentEntity } from "./comment.interface";

export interface ActivityCommentEntity extends CommentEntity {
    id: number;
    activityId: number;
    classId: string;
}

export const ACTIVITY_COMMENT_TABLE = 'activity_comment';

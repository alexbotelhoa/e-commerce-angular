export interface CommentEntity {
    id: number;
    text: string;
    userId: number;
    parentId: number | null;
}

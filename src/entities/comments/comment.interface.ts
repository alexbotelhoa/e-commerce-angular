export interface CommentEntity {
    id: number;
    text: string;
    userId: string;
    parentId: number | null;
    createdAt: string | Date;
}

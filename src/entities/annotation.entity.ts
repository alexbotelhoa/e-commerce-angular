export interface AnnotationEntity {
    id: string;
    userId: string;
    meetingId: string;
    createdDate: string;
    updatedDate: string;
    data: string
}

export const ANNOTATION_TABLE = 'annotation';

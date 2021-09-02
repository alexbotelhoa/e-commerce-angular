export interface MaterialEntity {
    id: string;
    userId: string;
    classId: string;
    isbn: string;
    author: string;
    title: string;
    publisher: string;
    coverImg: string;
    isInternal: string;
    acquiredLanguageBooster: boolean;
    createdAt: string;
    updatedAt: string;
    active: boolean;

}

export const MATERIAL_TABLE = 'material';

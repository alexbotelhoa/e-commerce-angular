export interface MaterialEntity {
    id: string;
    userId: string;
    classId: string;
    isbn: string;
    author: string;
    title: string;
    publisher: string;
    coverImg: string;
    isInternal: boolean;
    acquiredLanguageBooster: boolean;
    languageBank: string | null;
    active: boolean;
    contextId: string;
    createdAt: string;
    updatedAt: string;
}

export const MATERIAL_TABLE = 'material';

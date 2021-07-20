export interface LevelCodeEntity {
    id: number;
    code: string;
    description: string | null;
    active: boolean;
    createdAt: string;
    levelId: number | null;
    learningMore: string | null;
}

export const LEVEL_CODE_TABLE = 'level_code';

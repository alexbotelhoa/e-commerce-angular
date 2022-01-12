export interface LevelCodeEntity {
    id: number;
    code: string;
    description: string | null;
    active: boolean;
    createdAt: string;
    levelId: number | null;
    learningMore: "kanttum" | "paginab2c" | "eyoung" | "spboost" | "podcast" | null;
}

export const LEVEL_CODE_TABLE = 'level_code';

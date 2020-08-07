export interface LevelEntity {
    id: number;
    name: string;
    description: string | null;
    order: number;
    active: boolean;
}

export const LEVEL_TABLE = 'level';

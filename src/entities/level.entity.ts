import { LevelTypeId } from "../domain/activity/enums/level-type.enum";

export interface LevelEntity {
    id: number;
    name: string;
    typeId: LevelTypeId;
    description: string | null;
    order: number;
    active: boolean;
}

export const LEVEL_TABLE = 'level';

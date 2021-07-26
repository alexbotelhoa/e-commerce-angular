import * as Knex from "knex";
import { deleteAllLevelCodes, insertLevelCode } from "../../src/shared/repositories/level-code.repository";
import { LevelCodeEntity } from "../../src/entities/level-code.entity";
import { deleteAllClasses } from "../../src/shared/repositories/class.repository";
import { levelCodesData } from "./data/level-codes.data";

export const basic1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt' | 'learningMore'> = {
    id: 1,
    code: 'BASIC-1',
    description: 'Basic course 1',
    active: true,
    levelId: 1,
}

export const basic2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt' | "learningMore"> = {
    id: 2,
    code: 'BASIC-2',
    description: 'Basic course 2',
    active: true,
    levelId: 1,
}

export const intermediary1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt' | "learningMore"> = {
    id: 3,
    code: 'INTERMEDIARY-1',
    description: 'Intermediary course 1',
    active: true,
    levelId: 2,
}

export const intermediary2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt' | "learningMore"> = {
    id: 4,
    code: 'INTERMEDIARY-2',
    description: 'Intermediary couse 2',
    active: true,
    levelId: 2,
}

export const advanced1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt' | "learningMore"> = {
    id: 5,
    code: 'ADVANCED-1',
    description: 'Advanced course 1',
    active: true,
    levelId: 3,
}

export const advanced2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt' | "learningMore"> = {
    id: 6,
    code: 'ADVANCED-2',
    description: 'Advanced course 2',
    active: true,
    levelId: 3,
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    // we need to delete classes here because it is not set to cascade for safety reasons
    await deleteAllClasses(knex);
    await deleteAllLevelCodes(knex);


    // Inserts seed entries
    await insertLevelCode(knex)([
        ...levelCodesData,
        basic1LevelCodeSeed,
        basic2LevelCodeSeed,
        intermediary1LevelCodeSeed,
        intermediary2LevelCodeSeed,
        advanced1LevelCodeSeed,
        advanced2LevelCodeSeed,
    ]);
}


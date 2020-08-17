import * as Knex from "knex";
import { deleteAllLevelCodes, insertLevelCode } from "../../src/shared/repositories/level-code.repository";
import { LevelCodeEntity } from "../../src/entities/level-code.entity";

export const basic1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 1,
    code: 'BASIC-1',
    description: 'Basic course 1',
    active: true,
}

export const basic2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 2,
    code: 'BASIC-2',
    description: 'Basic course 2',
    active: true,
}

export const intermediary1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 3,
    code: 'INTERMEDIARY-1',
    description: 'Intermediary course 1',
    active: true,
}

export const intermediary2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 4,
    code: 'INTERMEDIARY-2',
    description: 'Intermediary couse 2',
    active: true,
}

export const advanced1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 5,
    code: 'ADVANCED-1',
    description: 'Advanced course 1',
    active: true,
}

export const advanced2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 6,
    code: 'ADVANCED-2',
    description: 'Advanced course 2',
    active: true,
}

export async function seed(knex: Knex<LevelCodeEntity, LevelCodeEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllLevelCodes(knex);

    // Inserts seed entries
    await insertLevelCode(knex)([
        basic1LevelCodeSeed,
        basic2LevelCodeSeed,
        intermediary1LevelCodeSeed,
        intermediary2LevelCodeSeed,
        advanced1LevelCodeSeed,
        advanced2LevelCodeSeed,
    ]);
}


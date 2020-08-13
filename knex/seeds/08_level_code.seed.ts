import * as Knex from "knex";
import { deleteAllLevelCodes, insertLevelCode } from "../../src/shared/repositories/level-code.repository";
import { LevelCodeEntity } from "../../src/entities/level-code.entity";

export const basic1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 'BASIC-1', active: true
}

export const basic2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 'BASIC-2', active: true
}

export const intermediary1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 'INTERMEDIARY-1', active: true
}

export const intermediary2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 'INTERMEDIARY-2', active: true
}

export const advanced1LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 'ADVANCED-1', active: true
}

export const advanced2LevelCodeSeed: Omit<LevelCodeEntity, 'createdAt'> = {
    id: 'ADVANCED-2', active: true
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


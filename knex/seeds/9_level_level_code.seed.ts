import * as Knex from "knex";
import { LevelLevelCodeEntity } from "../../src/entities/level-level-code.entity";
import { deleteAllLevelLevelCodes, insertLevelLevelCode } from "../../src/shared/repositories/level-level-code.repository";

export async function seed(knex: Knex<LevelLevelCodeEntity, LevelLevelCodeEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllLevelLevelCodes(knex);

    // Inserts seed entries
    await insertLevelLevelCode(knex)([
        {
            levelId: 1, levelCodeId: 'BASIC-1',
        },
        {
            levelId: 1, levelCodeId: 'BASIC-2',
        },
        {
            levelId: 2, levelCodeId: 'INTERMEDIARY-1',
        },
        {
            levelId: 2, levelCodeId: 'INTERMEDIARY-2',
        },
        {
            levelId: 3, levelCodeId: 'ADVANCED-1',
        },
        {
            levelId: 3, levelCodeId: 'ADVANCED-2',
        },
    ]);
}


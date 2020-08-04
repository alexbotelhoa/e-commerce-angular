import * as Knex from "knex";
import { deleteAllLevelCodes, insertLevelCode } from "../../src/shared/repositories/level-code.repository";
import { LevelCodeEntity } from "../../src/entities/level-code.entity";

export async function seed(knex: Knex<LevelCodeEntity, LevelCodeEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllLevelCodes(knex);

    // Inserts seed entries
    await insertLevelCode(knex)([
        { id: 'BASIC-1', active: true },
        { id: 'BASIC-2', active: true },
        { id: 'INTERMEDIARY-1', active: true },
        { id: 'INTERMEDIARY-2', active: true },
        { id: 'ADVANCED-1', active: true },
        { id: 'ADVANCED-2', active: true },
    ]);
}


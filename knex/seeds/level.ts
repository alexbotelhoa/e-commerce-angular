import * as Knex from "knex";
import { insertLevel, deleteAllLevels } from "../../src/shared/repositories/level.repository";
import { LevelEntity } from "../../src/entities/level.entity";

export async function seed(knex: Knex<LevelEntity, LevelEntity>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllLevels(knex);

    // Inserts seed entries
    await insertLevel(knex)([
        { id: 1, name: "Level 1", order: 1, active: false },
        { id: 2, name: "Level 2", order: 2 },
        { id: 3, name: "Level 3", order: 3 }
    ]);
}


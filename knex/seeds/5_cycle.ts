import * as Knex from "knex";
import { insertCycle, deleteAllCycles } from "../../src/shared/repositories/cycle.repository";
import { CycleEntity } from "../../src/entities/cycle.entity";

export async function seed(knex: Knex<CycleEntity, CycleEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllCycles(knex);

    // Inserts seed entries
    await insertCycle(knex)([
        { id: 1, name: "Cycle 1", levelThemeId: 1 },
        { id: 2, name: "Cycle 2", levelThemeId: 1 },
        { id: 3, name: "Cycle 3", levelThemeId: 1 }
    ]);
}
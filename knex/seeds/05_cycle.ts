import * as Knex from "knex";
import { insertCycle, deleteAllCycles } from "../../src/shared/repositories/cycle.repository";
import { CycleEntity } from "../../src/entities/cycle.entity";

export const cycle1Seed: CycleEntity = { id: 1, name: "Cycle 1", levelThemeId: 1, order: 1, active: true, };
export const cycle2Seed: CycleEntity = { id: 2, name: "Cycle 2", levelThemeId: 1, order: 2, active: true, };
export const cycle3Seed: CycleEntity = { id: 3, name: "Cycle 3", levelThemeId: 1, order: 3, active: true, };

export async function seed(knex: Knex<CycleEntity, CycleEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllCycles(knex);

    // Inserts seed entries
    await insertCycle(knex)([
        cycle1Seed,
        cycle2Seed,
        cycle3Seed,
    ]);
}

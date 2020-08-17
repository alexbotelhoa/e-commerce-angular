import * as Knex from "knex";
import { insertCycleActivity, deleteAllCycleActivities } from "../../src/shared/repositories/cycle-activity.repository";
import { CycleActivityEntity } from "../../src/entities/cycle-activity.entity";
import { cycle1Seed } from "./05_cycle";

export const cycleActivity1Seed: CycleActivityEntity = {
    id: 1,
    cycleId: cycle1Seed.id,
    activityId: 1,
    order: 1,
}

export const cycleActivity2Seed: CycleActivityEntity = {
    id: 2,
    cycleId: cycle1Seed.id,
    activityId: 2,
    order: 2,
}

export const cycleActivity3Seed: CycleActivityEntity = {
    id: 3,
    cycleId: cycle1Seed.id,
    activityId: 3,
    order: 3,
}

export async function seed(knex: Knex<CycleActivityEntity, CycleActivityEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllCycleActivities(knex);

    // Inserts seed entries
    await insertCycleActivity(knex)([
        cycleActivity1Seed,
        cycleActivity2Seed,
        cycleActivity3Seed,
    ]);
}


import * as Knex from "knex";
import { insertCycleActivity, deleteAllCycleActivitys } from "../../src/shared/repositories/cycle-activity.repository";
import { CycleActivityEntity } from "../../src/entities/cycle-activity.entity";

export async function seed(knex: Knex<CycleActivityEntity, CycleActivityEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllCycleActivitys(knex);

    // Inserts seed entries
    await insertCycleActivity(knex)([
        { id: 1, cycleId: 1, activityId: 1, order: 1 },
        { id: 2, cycleId: 1, activityId: 2, order: 2 },
        { id: 3, cycleId: 1, activityId: 3, order: 3 }
    ]);
}


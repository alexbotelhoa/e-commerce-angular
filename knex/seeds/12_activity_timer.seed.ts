import * as Knex from "knex";
import { deleteAllActivityTimers, insertActivityTimer } from "../../src/shared/repositories/activity-timer.repository";
import { ActivityTimerEntity } from "../../src/entities/activities/activity-timer.entity";
import { cycleActivity1Seed, cycleActivity2Seed } from "./06_cycle_activity";
import { studentUserSeed } from "./07_user.seed";
import { basicClass1Seed } from "./09_class.seed";

const activityTimer1Seed: Partial<ActivityTimerEntity> = {
    id: 1,
    completed: false,
    completionTime: null,
    cycleActivityId: cycleActivity1Seed.id,
    userId: studentUserSeed.id,
    classId: basicClass1Seed.id,
};

const activityTimer2Seed: Partial<ActivityTimerEntity> = {
    id: 2,
    completed: true,
    completionTime: new Date(),
    cycleActivityId: cycleActivity2Seed.id,
    userId: studentUserSeed.id,
    classId: basicClass1Seed.id,
};

export async function seed(knex: Knex<ActivityTimerEntity, ActivityTimerEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllActivityTimers(knex);

    // Inserts seed entries
    await insertActivityTimer(knex)([
        activityTimer1Seed,
        activityTimer2Seed,
    ]);
}


import * as Knex from "knex";
import { deleteAllEnrollments, insertEnrollment } from "../../src/shared/repositories/enrollment.repository";
import { studentUserSeed } from "./07_user.seed";
import { class1Seed, class2Seed } from "./09_class.seed";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllEnrollments(knex);

    await insertEnrollment(knex)([
        {
            id: 1,
            classId: class1Seed.id,
            userId: studentUserSeed.id,
        },
        {
            id: 2,
            classId: class2Seed.id,
            userId: studentUserSeed.id,
        },
    ])
};

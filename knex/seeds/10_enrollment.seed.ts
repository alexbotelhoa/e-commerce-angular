import * as Knex from "knex";
import { deleteAllEnrollments, insertEnrollment } from "../../src/shared/repositories/enrollment.repository";
import { studentUserSeed } from "./07_user.seed";
import { basic1LevelCodeSeed, basic2LevelCodeSeed } from "./08_level_code.seed";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllEnrollments(knex);

    await insertEnrollment(knex)([
        {
            id: 1,
            levelCodeId: basic1LevelCodeSeed.id,
            userId: studentUserSeed.id,
        },
        {
            id: 2,
            levelCodeId: basic2LevelCodeSeed.id,
            userId: studentUserSeed.id,
        },
    ]);
}

import * as Knex from "knex";
import { teacherUserSeed } from "./07_user.seed";
import { class1Seed, class2Seed } from "./09_class.seed";
import { deleteAllTeacherClasses, insertTeacherClass } from "../../src/shared/repositories/teacher-class.repository";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllTeacherClasses(knex);

    await insertTeacherClass(knex)([
        {
            id: 1,
            classId: class1Seed.id,
            teacherId: teacherUserSeed.id,
        },
        {
            id: 2,
            classId: class2Seed.id,
            teacherId: teacherUserSeed.id,
        },
    ])
};

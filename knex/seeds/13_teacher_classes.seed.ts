import * as Knex from "knex";
import { teacherUserSeed, fullUserSeed } from "./07_user.seed";
import { basicClass1Seed, intermediaryClass2Seed } from "./09_class.seed";
import { deleteAllTeacherClasses, insertTeacherClass } from "../../src/shared/repositories/teacher-class.repository";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllTeacherClasses(knex);

    await insertTeacherClass(knex)([
        {
            id: 1,
            classId: basicClass1Seed.id,
            teacherId: teacherUserSeed.id,
        },
        {
            id: 2,
            classId: intermediaryClass2Seed.id,
            teacherId: teacherUserSeed.id,
        },
        {
            id: 3,
            classId: basicClass1Seed.id,
            teacherId: fullUserSeed.id,
        },
        {
            id: 4,
            classId: intermediaryClass2Seed.id,
            teacherId: fullUserSeed.id,
        },
    ])
};

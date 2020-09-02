import * as Knex from "knex";
import { EnrollmentClassEntity } from "../../src/entities/enrollment-class.entity";
import { class1Seed, class2Seed, class3Seed } from "./09_class.seed";
import { enrollmentSeeds } from "./10_enrollment.seed";
import { deleteAllEnrollmentClasses, insertEnrollmentClass } from "../../src/shared/repositories/enrollment-class.repository";

export const enrollmentClassSeeds: EnrollmentClassEntity[] = [
    {
        id: 1,
        classId: class1Seed.id,
        enrollmentId: enrollmentSeeds[0].id,
    },
    {
        id: 2,
        classId: class2Seed.id,
        enrollmentId: enrollmentSeeds[1].id,
    },
    {
        id: 3,
        classId: class3Seed.id,
        enrollmentId: enrollmentSeeds[2].id,
    },
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllEnrollmentClasses(knex);

    await insertEnrollmentClass(knex)(enrollmentClassSeeds);
}

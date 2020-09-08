import * as Knex from "knex";
import { EnrollmentClassEntity } from "../../src/entities/enrollment-class.entity";
import { basicClass1Seed, intermediaryClass2Seed, advancedClass3Seed } from "./09_class.seed";
import { enrollmentSeeds, enrollmentStudentBasic1Seed, enrollmentStudentIntermediary2Seed, enrollmentStudentAdvanced3Seed, enrollmentFullBasic4Seed, enrollmentFullIntermediary5Seed, enrollmentFullAdvanced6Seed } from "./10_enrollment.seed";
import { deleteAllEnrollmentClasses, insertEnrollmentClass } from "../../src/shared/repositories/enrollment-class.repository";

export const enrollmentClassSeeds: EnrollmentClassEntity[] = [
    {
        id: 1,
        classId: basicClass1Seed.id,
        enrollmentId: enrollmentStudentBasic1Seed.id,
    },
    {
        id: 2,
        classId: intermediaryClass2Seed.id,
        enrollmentId: enrollmentStudentIntermediary2Seed.id,
    },
    {
        id: 3,
        classId: advancedClass3Seed.id,
        enrollmentId: enrollmentStudentAdvanced3Seed.id,
    },
    {
        id: 4,
        classId: basicClass1Seed.id,
        enrollmentId: enrollmentFullBasic4Seed.id,
    },
    {
        id: 5,
        classId: intermediaryClass2Seed.id,
        enrollmentId: enrollmentFullIntermediary5Seed.id,
    },
    {
        id: 6,
        classId: advancedClass3Seed.id,
        enrollmentId: enrollmentFullAdvanced6Seed.id,
    },
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllEnrollmentClasses(knex);

    await insertEnrollmentClass(knex)(enrollmentClassSeeds);
}

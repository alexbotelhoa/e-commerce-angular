import * as Knex from "knex";
import { deleteAllEnrollments, insertEnrollment } from "../../src/shared/repositories/enrollment.repository";
import { studentUserSeed, fullUserSeed } from "./07_user.seed";
import { basic1LevelCodeSeed, intermediary1LevelCodeSeed, advanced1LevelCodeSeed } from "./08_level_code.seed";
import { EnrollmentEntity } from "../../src/entities/enrollment.entity";


export const enrollmentStudentBasic1Seed: EnrollmentEntity = {
    id: 1,
    levelCodeId: basic1LevelCodeSeed.id,
    userId: studentUserSeed.id,
};

export const enrollmentStudentIntermediary2Seed: EnrollmentEntity = {
    id: 2,
    levelCodeId: intermediary1LevelCodeSeed.id,
    userId: studentUserSeed.id,
};

export const enrollmentStudentAdvanced3Seed: EnrollmentEntity = {
    id: 3,
    levelCodeId: advanced1LevelCodeSeed.id,
    userId: studentUserSeed.id,
};

export const enrollmentFullBasic4Seed: EnrollmentEntity = {
    id: 4,
    levelCodeId: basic1LevelCodeSeed.id,
    userId: fullUserSeed.id,
};

export const enrollmentFullIntermediary5Seed: EnrollmentEntity = {
    id: 5,
    levelCodeId: intermediary1LevelCodeSeed.id,
    userId: fullUserSeed.id,
};

export const enrollmentFullAdvanced6Seed: EnrollmentEntity = {
    id: 6,
    levelCodeId: advanced1LevelCodeSeed.id,
    userId: fullUserSeed.id,
};


export const enrollmentSeeds: EnrollmentEntity[] = [
    enrollmentStudentBasic1Seed,
    enrollmentStudentIntermediary2Seed,
    enrollmentStudentAdvanced3Seed,
    enrollmentFullBasic4Seed,
    enrollmentFullIntermediary5Seed,
    enrollmentFullAdvanced6Seed,
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllEnrollments(knex);

    await insertEnrollment(knex)(enrollmentSeeds);
}

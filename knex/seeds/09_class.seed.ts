import * as Knex from "knex";
import { ClassEntity } from "../../src/entities/class.entity";
import { deleteAllClasses, insertClass } from "../../src/shared/repositories/class.repository";
import { basic1LevelCodeSeed, intermediary1LevelCodeSeed, advanced1LevelCodeSeed } from "./08_level_code.seed";

export const basicClass1Seed: ClassEntity = {
    id: '1',
    name: 'Class Basic - 1',
    levelCodeId: basic1LevelCodeSeed.id,
    carrerId: null,
    institutionId: null,
    periodId: null,
    sessionId: null,
    startDate: null,
    endDate: null,
}

export const intermediaryClass2Seed: ClassEntity = {
    id: '2',
    name: 'Class Intermediary - 2',
    levelCodeId: intermediary1LevelCodeSeed.id,
    carrerId: null,
    institutionId: null,
    periodId: null,
    sessionId: null,
    startDate: null,
    endDate: null,
}

export const advancedClass3Seed: ClassEntity = {
    id: '3',
    name: 'Class Advanced - 3',
    levelCodeId: advanced1LevelCodeSeed.id,
    carrerId: null,
    institutionId: null,
    periodId: null,
    sessionId: null,
    startDate: null,
    endDate: null,
}

export const allClassSeeds = [
    basicClass1Seed,
    intermediaryClass2Seed,
    advancedClass3Seed,
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllClasses(knex);

    await insertClass(knex)(allClassSeeds);
}

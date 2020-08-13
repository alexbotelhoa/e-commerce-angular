import * as Knex from "knex";
import { ClassEntity } from "../../src/entities/class.entity";
import { basic1LevelCodeSeed, intermediary2LevelCodeSeed } from "./08_level_code.seed";
import { deleteAllClasses, insertClass } from "../../src/shared/repositories/class.repository";

export const class1Seed: ClassEntity = {
    id: 1,
    name: 'Class Basic - 1',
    levelCodeId: basic1LevelCodeSeed.id,
}

export const class2Seed: ClassEntity = {
    id: 2,
    name: 'Class Intermediary - 2',
    levelCodeId: intermediary2LevelCodeSeed.id,
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllClasses(knex);

    await insertClass(knex)([
        class1Seed,
        class2Seed,
    ]);
}

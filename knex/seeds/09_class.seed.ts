import * as Knex from "knex";
import { ClassEntity } from "../../src/entities/class.entity";
import { deleteAllClasses, insertClass } from "../../src/shared/repositories/class.repository";
import { levelCodesData } from "./data/level-codes.data";

export const class1Seed: ClassEntity = {
    id: 1,
    name: 'Class Basic - 1',
    levelCodeId: levelCodesData[0].id,
}

export const class2Seed: ClassEntity = {
    id: 2,
    name: 'Class Intermediary - 2',
    levelCodeId: levelCodesData[1].id,
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllClasses(knex);

    await insertClass(knex)([
        class1Seed,
        class2Seed,
    ]);
}

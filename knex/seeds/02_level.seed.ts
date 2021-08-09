import * as Knex from "knex";
import { insertLevel, deleteAllLevels } from "../../src/shared/repositories/level.repository";
import { LevelEntity } from "../../src/entities/level.entity";
import { LevelTypeId } from "../../src/resolvers-types";
import { deleteAllLevelCodes } from "../../src/shared/repositories/level-code.repository";
import { deleteAllClasses } from "../../src/shared/repositories/class.repository";

export const level1Seed: LevelEntity = {
    id: 1,
    name: "Level 1",
    description: 'Level 1 description',
    order: 1,
    active: true,
    typeId: LevelTypeId.ADULT,
};
export const level2Seed: LevelEntity = {
    id: 2,
    name: "Level 2",
    description: 'Level 2 description',
    order: 2,
    active: false,
    typeId: LevelTypeId.ADULT,
};
export const level3Seed: LevelEntity = {
    id: 3,
    name: "Level 3",
    description: 'Level 3 description',
    order: 3,
    active: true,
    typeId: LevelTypeId.YOUNG,
};

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllClasses(knex);
    await deleteAllLevelCodes(knex);
    await deleteAllLevels(knex);

    // Inserts seed entries
    await insertLevel(knex)([
        level1Seed,
        level2Seed,
        level3Seed,
    ]);
}

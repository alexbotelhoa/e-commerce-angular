import * as Knex from "knex";
import { LevelLevelCodeEntity } from "../../src/entities/level-level-code.entity";
import { deleteAllLevelLevelCodes, insertLevelLevelCode } from "../../src/shared/repositories/level-level-code.repository";
import { basic1LevelCodeSeed, basic2LevelCodeSeed, intermediary1LevelCodeSeed, intermediary2LevelCodeSeed, advanced1LevelCodeSeed, advanced2LevelCodeSeed } from "./08_level_code.seed";
import { level1Seed, level2Seed, level3Seed } from "./02_level.seed";

export async function seed(knex: Knex<LevelLevelCodeEntity, LevelLevelCodeEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllLevelLevelCodes(knex);

    // Inserts seed entries
    await insertLevelLevelCode(knex)([
        {
            levelId: level1Seed.id, levelCodeId: basic1LevelCodeSeed.id,
        },
        {
            levelId: level1Seed.id, levelCodeId: basic2LevelCodeSeed.id,
        },
        {
            levelId: level2Seed.id, levelCodeId: intermediary1LevelCodeSeed.id,
        },
        {
            levelId: level2Seed.id, levelCodeId: intermediary2LevelCodeSeed.id,
        },
        {
            levelId: level3Seed.id, levelCodeId: advanced1LevelCodeSeed.id,
        },
        {
            levelId: level3Seed.id, levelCodeId: advanced2LevelCodeSeed.id,
        },
    ]);
}


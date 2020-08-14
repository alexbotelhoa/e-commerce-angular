import * as Knex from "knex";
import { insertLevelTheme, deleteAllLevelThemes } from "../../src/shared/repositories/level-theme.repository";
import { LevelThemeEntity } from "../../src/entities/level-theme.entity";
import { theme1Seed, theme2Seed, theme3Seed } from "./03_theme";
import { level1Seed, level2Seed, level3Seed } from "./02_level.seed";

export const level1ThemeSeed: LevelThemeEntity = { id: 1, themeId: theme1Seed.id, levelId: level1Seed.id, order: 1 };
export const level2ThemeSeed: LevelThemeEntity = { id: 2, themeId: theme2Seed.id, levelId: level2Seed.id, order: 2 };
export const level3ThemeSeed: LevelThemeEntity = { id: 3, themeId: theme3Seed.id, levelId: level3Seed.id, order: 3 };

export async function seed(knex: Knex<LevelThemeEntity, LevelThemeEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllLevelThemes(knex);

    // Inserts seed entries
    await insertLevelTheme(knex)([
        level1ThemeSeed,
        level2ThemeSeed,
        level3ThemeSeed,
    ]);
}


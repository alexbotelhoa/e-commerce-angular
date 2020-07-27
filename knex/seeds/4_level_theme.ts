import * as Knex from "knex";
import { insertLevelTheme, deleteAllLevelThemes } from "../../src/shared/repositories/level-theme.repository";
import { LevelThemeEntity } from "../../src/entities/level-theme.entity";

export async function seed(knex: Knex<LevelThemeEntity, LevelThemeEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllLevelThemes(knex);

    // Inserts seed entries
    await insertLevelTheme(knex)([
        { id: 1, themeId: 1, levelId: 1, order: 1 },
        { id: 2, themeId: 2, levelId: 1, order: 2 },
        { id: 3, themeId: 3, levelId: 1, order: 3 }
    ]);
}


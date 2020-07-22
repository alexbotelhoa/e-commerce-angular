import * as Knex from "knex";
import { insertTheme, deleteAllThemes } from "../../src/shared/repositories/theme.repository";
import { ThemeEntity } from "../../src/entities/theme.entity";

export async function seed(knex: Knex<ThemeEntity, ThemeEntity>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllThemes(knex);

    // Inserts seed entries
    await insertTheme(knex)([
        { id: 1, name: "Theme 1", active: false },
        { id: 2, name: "Theme 2"},
        { id: 3, name: "Theme 3"}
    ]);
}
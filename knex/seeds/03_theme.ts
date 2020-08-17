import * as Knex from "knex";
import { insertTheme, deleteAllThemes } from "../../src/shared/repositories/theme.repository";
import { ThemeEntity } from "../../src/entities/theme.entity";

export const theme1Seed: ThemeEntity = {
    id: 1,
    name: 'Theme 1',
    active: true,
    startColor: '#000000',
    endColor: '#FFFFFF',
}

export const theme2Seed: ThemeEntity = {
    id: 2,
    name: 'Theme 2',
    active: true,
    startColor: '#000000',
    endColor: '#FFFFFF',
}

export const theme3Seed: ThemeEntity = {
    id: 3,
    name: 'Theme 3',
    active: true,
    startColor: '#000000',
    endColor: '#FFFFFF',
}

export async function seed(knex: Knex<ThemeEntity, ThemeEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllThemes(knex);

    // Inserts seed entries
    await insertTheme(knex)([
        theme1Seed,
        theme2Seed,
        theme3Seed,
    ]);
}

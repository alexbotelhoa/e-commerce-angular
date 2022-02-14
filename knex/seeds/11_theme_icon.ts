import * as Knex from "knex";
import { insertThemeIcon, deleteAllThemeIconsData } from "../../src/shared/repositories/theme-icon.repository";
import { ThemeIconEntity } from "../../src/entities/theme-icon.entity";
import SpeechIcon from "./attachments/speech-icon.base64";
import { allThemesSeeds } from "./03_theme";

export const allThemeIcons = allThemesSeeds.map<ThemeIconEntity>(theme => ({
    themeId: theme.id,
    content: SpeechIcon.data,
}));

export async function seed(knex: Knex<ThemeIconEntity, ThemeIconEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllThemeIconsData(knex);

    // Inserts seed entries
    await insertThemeIcon(knex)(allThemeIcons);
}

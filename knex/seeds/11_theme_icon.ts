import * as Knex from "knex";
import { insertThemeIcon, deleteAllThemeIconsData } from "../../src/shared/repositories/theme-icon.repository";
import { ThemeIconEntity } from "../../src/entities/themes/theme-icon.entity";
import SpeechIcon from "./attachments/speech-icon.base64"

export async function seed(knex: Knex<ThemeIconEntity, ThemeIconEntity[]>): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllThemeIconsData(knex);

    // Inserts seed entries
    await insertThemeIcon(knex)([{ themeId: 1, content: SpeechIcon.data }]);
}
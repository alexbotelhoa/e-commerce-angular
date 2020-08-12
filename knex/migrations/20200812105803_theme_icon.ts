import * as Knex from "knex";
import { THEME_ICON_TABLE } from "../../src/entities/themes/theme-icon.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(THEME_ICON_TABLE, (table) => {
        table.integer('themeId').primary().unsigned().unique();
        table.foreign('themeId').references('theme.id').onDelete('CASCADE');
        table.text('content', 'longtext').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(THEME_ICON_TABLE);
}
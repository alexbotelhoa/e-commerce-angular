import * as Knex from "knex";
import { THEME_ICON_TABLE } from "../../src/entities/themes/theme-icon.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(THEME_ICON_TABLE, (table) => {
        setUTF8Table(table);
        table.integer('themeId').primary().unsigned();
        table.foreign('themeId').references('theme.id').onDelete('CASCADE');
        table.text('content', 'mediumtext').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(THEME_ICON_TABLE);
}

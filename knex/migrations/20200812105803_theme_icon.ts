import * as Knex from "knex";
import { THEME_ICON_TABLE } from "../../src/entities/theme-icon.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(THEME_ICON_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(THEME_ICON_TABLE, (table) => {
            setUTF8Table(table);
            table.integer('themeId').primary().unsigned();
            table.foreign('themeId').references('theme.id').onDelete('CASCADE');
            table.text('content', 'mediumtext').notNullable();
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(THEME_ICON_TABLE);
}

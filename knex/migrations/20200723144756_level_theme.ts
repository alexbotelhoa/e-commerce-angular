import * as Knex from "knex";
import { LEVEL_THEME_TABLE } from "../../src/entities/level-theme.entity"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(LEVEL_THEME_TABLE, (table) => {
        table.increments('id');
        table.integer('order', 3);

        table.integer('themeId').unsigned().notNullable();
        table.integer('levelId').unsigned().notNullable();

        table.foreign('themeId').references('theme.id').onDelete('CASCADE');
        table.foreign('levelId').references('level.id').onDelete('CASCADE');

        table.index('order');
        table.index('themeId');
        table.index('levelId');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(LEVEL_THEME_TABLE);
}
import * as Knex from "knex";
import { LEVEL_THEME_TABLE } from "../../src/entities/level-theme.entity"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(LEVEL_THEME_TABLE, (table) => {
        table.increments('id');
        table.integer('order', 3).defaultTo(0);

        table.integer('themeId').unsigned().notNullable();
        table.integer('levelId').unsigned().notNullable();

        table.foreign('themeId').references('theme.id').onDelete('CASCADE');
        table.foreign('levelId').references('level.id').onDelete('CASCADE');

        table.index('order');
        table.index('themeId');
        table.index('levelId');

        table.unique(['themeId', 'levelId']);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(LEVEL_THEME_TABLE);
}

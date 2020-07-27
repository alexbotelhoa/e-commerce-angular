import * as Knex from "knex";
import { CYCLE_TABLE } from "../../src/entities/cycle.entity"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(CYCLE_TABLE, (table) => {
        table.increments('id');
        table.string('name', 100);
        table.boolean('active').notNullable().defaultTo(true);

        table.integer('levelThemeId').unsigned().notNullable();
        table.foreign('levelThemeId').references('level_theme.id').onDelete('CASCADE');

        table.index('active');
        table.index('levelThemeId');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(CYCLE_TABLE);
}
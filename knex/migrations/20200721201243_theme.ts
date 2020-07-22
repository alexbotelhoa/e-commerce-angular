import * as Knex from "knex";
import { THEME_TABLE } from "../../src/entities/theme.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(THEME_TABLE, (table) => {
        table.increments('id');
        table.string('name', 100).notNullable();
        table.boolean('active').notNullable().defaultTo(true);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('active');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(THEME_TABLE);
}


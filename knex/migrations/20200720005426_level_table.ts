import * as Knex from "knex";
import { LEVEL_TABLE } from "../../src/entities/level.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(LEVEL_TABLE, (table) => {
        table.increments('id');
        table.string('name', 100).notNullable();
        table.integer('order', 3);
        table.boolean('active').notNullable().defaultTo(true);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('order');
        table.index('active');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(LEVEL_TABLE);
}


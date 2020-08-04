import * as Knex from "knex";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(LEVEL_CODE_TABLE, (table) => {
        table.string('id', 30).primary();
        table.boolean('active').notNullable().defaultTo(true);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('active');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(LEVEL_CODE_TABLE);
}


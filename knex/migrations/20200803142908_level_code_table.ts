import * as Knex from "knex";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(LEVEL_CODE_TABLE, (table) => {
        setUTF8Table(table);
        table.string('id', 30).primary();
        table.boolean('active').notNullable().defaultTo(true);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('active');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(LEVEL_CODE_TABLE);
}


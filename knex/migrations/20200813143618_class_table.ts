import * as Knex from "knex";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(CLASS_TABLE, (table) => {
        setUTF8Table(table);
        table.integer('id').unsigned().primary();
        table.string('name', 100).notNullable();
        table.integer('levelCodeId').unsigned().references(`${LEVEL_CODE_TABLE}.id`);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('levelCodeId');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(CLASS_TABLE);
}


import * as Knex from "knex";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(CLASS_TABLE, (table) => {
        table.integer('id').unsigned().primary();
        table.string('name', 100).notNullable();
        table.string('levelCodeId').references(`${LEVEL_CODE_TABLE}.id`);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('levelCodeId');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(CLASS_TABLE);
}


import * as Knex from "knex";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { LEVEL_TABLE } from "../../src/entities/level.entity";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('level_level_code');

    await knex.schema.alterTable(LEVEL_CODE_TABLE, (table => {
        table.integer('levelId').unsigned().references(`${LEVEL_TABLE}.id`);
    }))

}

export async function down(knex: Knex): Promise<void> {
    // restore table as it was before
    await knex.schema.createTable('level_level_code', (table) => {
        setUTF8Table(table);
        table.integer('levelId').unsigned().notNullable().references(`${LEVEL_TABLE}.id`).onDelete("CASCADE");
        table.integer('levelCodeId').unsigned().notNullable().references(`${LEVEL_CODE_TABLE}.id`).onDelete("CASCADE");
        table.primary(['levelId', 'levelCodeId']);
        table.index(['levelCodeId', 'levelId'])
    });

    await knex.schema.alterTable(LEVEL_CODE_TABLE, (table => {
        table.dropForeign(['levelId']);
    }))
}


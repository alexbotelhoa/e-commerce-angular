import * as Knex from "knex";
import { LEVEL_TABLE } from "../../src/entities/level.entity";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";
import { LEVEL_LEVEL_CODE_TABLE } from "../../src/entities/level-level-code.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    // easier to just recreate the whole tables because of PK changes 
    await knex.schema.dropTableIfExists(LEVEL_LEVEL_CODE_TABLE);
    await knex.schema.dropTableIfExists(LEVEL_CODE_TABLE);

    await knex.schema.createTable(LEVEL_CODE_TABLE, (table) => {
        setUTF8Table(table);
        table.integer('id').unsigned().primary();
        table.string('code', 30).notNullable();
        table.string('description', 200);
        table.boolean('active').notNullable().defaultTo(true);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('active');
    });

    await knex.schema.createTable(LEVEL_LEVEL_CODE_TABLE, (table) => {
        setUTF8Table(table);
        table.integer('levelId').unsigned().notNullable().references(`${LEVEL_TABLE}.id`).onDelete("CASCADE");
        table.integer('levelCodeId').unsigned().notNullable().references(`${LEVEL_CODE_TABLE}.id`).onDelete("CASCADE");
        table.primary(['levelId', 'levelCodeId']);
    });
}


export async function down(knex: Knex): Promise<void> {
    // recreate tables as they were previously
    await knex.schema.dropTable(LEVEL_LEVEL_CODE_TABLE);
    await knex.schema.dropTable(LEVEL_CODE_TABLE);

    await knex.schema.createTable(LEVEL_CODE_TABLE, (table) => {
        setUTF8Table(table);
        table.string('id', 30).primary();
        table.boolean('active').notNullable().defaultTo(true);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('active');
    });

    await knex.schema.createTable(LEVEL_LEVEL_CODE_TABLE, (table) => {
        setUTF8Table(table);
        table.integer('levelId').unsigned().references('level.id').onDelete("CASCADE");
        table.string('levelCodeId', 30).references('level_code.id').onDelete("CASCADE");
        table.primary(['levelId', 'levelCodeId']);
    });
}


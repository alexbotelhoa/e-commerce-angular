import * as Knex from "knex";
import { LEVEL_TABLE } from "../../src/entities/level.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(LEVEL_TABLE, (table) => {
        table.integer('typeId', 2).unsigned().notNullable().defaultTo(1);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(LEVEL_TABLE, (table) => {
        table.dropColumn('typeId');
    });
}


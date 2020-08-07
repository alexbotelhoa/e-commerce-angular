import * as Knex from "knex";
import { CYCLE_TABLE } from "../../src/entities/cycle.entity"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CYCLE_TABLE, (table) => {
        table.integer('order', 3).defaultTo(0);
        table.index('order');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CYCLE_TABLE, (table) => {
        table.dropColumn('order');
        table.dropIndex('order');
    })
}

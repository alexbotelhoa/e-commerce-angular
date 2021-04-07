import * as Knex from "knex";
import { LOG_TABLE } from "../../src/entities/log.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(LOG_TABLE, (table) => {
        table.string('status');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(LOG_TABLE, (table) => {
        table.dropColumn('status');
    });
}


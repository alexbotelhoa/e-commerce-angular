import * as Knex from "knex";
import { EVENT_TABLE } from "../../src/entities/event.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(EVENT_TABLE, (table) => {
        table.dropColumn('startDate');
        table.dropColumn('endDate');
    });
    await knex.schema.alterTable(EVENT_TABLE, (table) => {
        table.string('startDate');
        table.string('endDate');
        table.string('lastUpdateTime');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(EVENT_TABLE, (table) => {
        table.dropColumn('startDate');
        table.dropColumn('endDate');
        table.dropColumn('lastUpdateTime');
        table.date('startDate');
        table.date('endDate');

    });
}


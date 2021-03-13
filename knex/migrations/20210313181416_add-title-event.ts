import * as Knex from "knex";
import { EVENT_TABLE } from "../../src/entities/event.entity";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(EVENT_TABLE, (table) => {
        table.string('title');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(EVENT_TABLE, (table) => {
        table.dropColumn('title');
    });
}


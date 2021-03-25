import * as Knex from "knex";
import { MEETING_TABLE } from "../../src/entities/meeting.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MEETING_TABLE, (table) => {
        table.dropColumn('date');
    });
    await knex.schema.alterTable(MEETING_TABLE, (table) => {
        table.string('date');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MEETING_TABLE, (table) => {
        table.dropColumn('date');
        table.date('date');

    });
}


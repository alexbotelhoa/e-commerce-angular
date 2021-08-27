import * as Knex from "knex";
import { MEETING_TABLE } from "../../src/entities/meeting.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MEETING_TABLE, (table) => {
        table.string("teacherNotes");
        table.string("homework");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MEETING_TABLE, (table) => {
        table.dropColumn("teacherNotes");
        table.dropColumn("homework");
    });
}

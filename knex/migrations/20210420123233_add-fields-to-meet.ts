import * as Knex from "knex";
import { MEETING_TABLE } from "../../src/entities/meeting.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MEETING_TABLE, (table) => {
        table.integer('attendTmpltNbr', 4);
        table.string('facilityId', 100);
        table.boolean('enabled').defaultTo(true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MEETING_TABLE, (table) => {
        table.dropColumn('attendTmpltNbr');
        table.dropColumn('facilityId');
        table.dropColumn('enabled');
    });
}


import * as Knex from "knex";
import { EMBEDDED_ACTIVITY_DATA_TABLE } from "../../src/entities/activities/embedded-activity-data.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(EMBEDDED_ACTIVITY_DATA_TABLE, (table) => {
        table.integer('height', 5).unsigned();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(EMBEDDED_ACTIVITY_DATA_TABLE, (table) => {
        table.dropColumn('height');
    });
}

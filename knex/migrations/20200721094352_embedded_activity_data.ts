import * as Knex from "knex";
import { EMBEDDED_ACTIVITY_DATA_TABLE } from "../../src/entities/activities/embedded-activity-data.entity";
import { baseActivityTableMigration } from "../utils/base-activity-table.migration";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(EMBEDDED_ACTIVITY_DATA_TABLE, (table) => {
        setUTF8Table(table);
        baseActivityTableMigration(table);
        table.string('url', 1000).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(EMBEDDED_ACTIVITY_DATA_TABLE);
}

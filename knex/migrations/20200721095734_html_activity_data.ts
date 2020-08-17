import * as Knex from "knex";
import { baseActivityTableMigration } from "../utils/base-activity-table.migration";
import { HTML_ACTIVITY_DATA_TABLE } from "../../src/entities/activities/html-activity-data.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(HTML_ACTIVITY_DATA_TABLE, (table) => {
        setUTF8Table(table);
        baseActivityTableMigration(table);
        table.text('html', 'text').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(HTML_ACTIVITY_DATA_TABLE);
    // old naming
    await knex.schema.dropTableIfExists('htmlActivityData');
}

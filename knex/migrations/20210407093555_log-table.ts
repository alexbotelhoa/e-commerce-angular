import * as Knex from "knex";
import { LOG_TABLE } from "../../src/entities/log.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";



export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(LOG_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(LOG_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id');
            table.text('body');
            table.string('key', 100);
            table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(LOG_TABLE);
}

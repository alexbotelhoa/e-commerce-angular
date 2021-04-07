import * as Knex from "knex";
import { COUNT_TABLE } from "../../src/entities/count.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(COUNT_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(COUNT_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id');
            table.string('name');
            table.integer('count');
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(COUNT_TABLE);
}


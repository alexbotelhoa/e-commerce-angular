import * as Knex from "knex";
import { ACTIVITY_TABLE } from "../../src/entities/activity.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(ACTIVITY_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(ACTIVITY_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id');
            table.string('name', 100).notNullable();
            table.string('description', 2000);
            table.boolean('active').notNullable().defaultTo(true);
            table.integer('typeId', 2).unsigned().notNullable();
            table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
            table.index('active');
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(ACTIVITY_TABLE);
}


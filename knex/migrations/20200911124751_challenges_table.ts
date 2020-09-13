import * as Knex from "knex";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { CHALLENGE_TABLE } from "../../src/entities/challenge.entity";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(CHALLENGE_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(CHALLENGE_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id').unsigned().primary();
            table.string('text', 100).notNullable();
            table.dateTime('startAt').notNullable().defaultTo(knex.fn.now());
            table.index('startAt');
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(CHALLENGE_TABLE);
}


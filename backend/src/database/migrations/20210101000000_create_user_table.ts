import * as Knex from "knex";
import { USER_TABLE } from "../../entities/user.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(USER_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(USER_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id').primary();
            table.string('name', 200).notNullable();
            table.string('email', 100).notNullable();
            table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(USER_TABLE);
}


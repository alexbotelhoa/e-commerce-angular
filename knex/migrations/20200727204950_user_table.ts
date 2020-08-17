import * as Knex from "knex";
import { USER_TABLE } from "../../src/entities/user.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(USER_TABLE, (table) => {
        setUTF8Table(table);
        table.integer('id').unsigned().primary();
        table.string('name', 200).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(USER_TABLE);
}


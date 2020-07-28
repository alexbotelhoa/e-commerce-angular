import * as Knex from "knex";
import { USER_TABLE } from "../../src/entities/user.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(USER_TABLE, (table) => {
        table.integer('id').unsigned().primary();
        table.string('name', 200).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(USER_TABLE);
}


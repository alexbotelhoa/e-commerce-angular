import * as Knex from "knex";
import { USER_TABLE } from "../../src/entities/user.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(USER_TABLE, (table) => {
        table.boolean("isAdult");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(USER_TABLE, (table) => {
        table.dropColumn("isAdult");
    });
}

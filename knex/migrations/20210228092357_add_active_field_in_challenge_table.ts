import * as Knex from "knex";
import { CHALLENGE_TABLE } from "../../src/entities/challenge.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CHALLENGE_TABLE, (table) => {
        table.boolean('active').notNullable().defaultTo(true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CHALLENGE_TABLE, (table) => {
        table.dropColumn('active');
    });
}


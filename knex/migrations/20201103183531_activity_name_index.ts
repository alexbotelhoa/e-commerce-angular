import * as Knex from "knex";
import { ACTIVITY_TABLE } from "../../src/entities/activity.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(ACTIVITY_TABLE, table => {
        table.index(['id', 'name']);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(ACTIVITY_TABLE, table => {
        table.dropIndex(['id', 'name']);
    })
}


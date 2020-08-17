import * as Knex from "knex";
import { ACTIVITY_TABLE } from "../../src/entities/activity.entity";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(ACTIVITY_TABLE, (table) => {
        table.string('estimatedTime', 50).notNullable().defaultTo('30 minutes');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(ACTIVITY_TABLE, (table) => {
        table.dropColumn('estimatedTime');
    });
}


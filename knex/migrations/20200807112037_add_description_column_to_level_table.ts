import * as Knex from "knex";
import { LEVEL_TABLE } from "../../src/entities/level.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(LEVEL_TABLE, (table) => {
        table.string('description', 2000);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(LEVEL_TABLE, (table) => {
        table.dropColumn('description');
    });
}

import * as Knex from "knex";
import { MATERIAL_TABLE } from "../../src/entities/material.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MATERIAL_TABLE, (table) => {
        table.string("contextId");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MATERIAL_TABLE, (table) => {
        table.dropColumn("contextId");
    });
}

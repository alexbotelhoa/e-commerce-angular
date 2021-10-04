import * as Knex from "knex";
import { MATERIAL_TABLE } from "../../src/entities/material.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MATERIAL_TABLE, (table) => {
        table.dropColumn("isInternal");
        
    });
    await knex.schema.alterTable(MATERIAL_TABLE, (table) => {
        table.boolean("isInternal").defaultTo(false);
        
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(MATERIAL_TABLE, (table) => {
        table.dropColumn("isInternal");
        table.string("isInternal").defaultTo(false);
    });
}


import * as Knex from "knex";
import { CLASS_TABLE } from "../../src/entities/class.entity";


export async function up(knex: Knex): Promise<void> {
        await knex.schema.alterTable(CLASS_TABLE, (table) => {
            table.boolean("hasActivated").defaultTo(true);
        });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CLASS_TABLE, (table) => {
        table.dropColumn("hasActivated");
    });
}

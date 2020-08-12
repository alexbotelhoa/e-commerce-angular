import * as Knex from "knex";
import { THEME_TABLE } from "../../src/entities/theme.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(THEME_TABLE, (table) => {
        table.string('startColor', 100).defaultTo("#000").notNullable();
        table.string('endColor', 100).defaultTo("#fff").notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(THEME_TABLE, (table) => {
        table.dropColumn('startColor');
        table.dropColumn('endColor');
    });
}

import * as Knex from "knex";
import { CLASS_TABLE } from "../../src/entities/class.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CLASS_TABLE, table => {
        table.date('startDate').index();
        table.date('endDate').index();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CLASS_TABLE, table => {
        table.dropColumn('startDate');
        table.dropColumn('endDate');
    })
}


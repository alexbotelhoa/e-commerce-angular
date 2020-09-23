import * as Knex from "knex";
import { CLASS_TABLE } from "../../src/entities/class.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CLASS_TABLE, table => {
        table.string('institutionId', 50).index();
        table.string('periodId', 50).index();
        table.string('carrerId', 50).index();
        table.string('sessionId', 50).index();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(CLASS_TABLE, table => {
        table.dropColumn('institutionId');
        table.dropColumn('periodId');
        table.dropColumn('carrerId');
        table.dropColumn('sessionId');
    })
}


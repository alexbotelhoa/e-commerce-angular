import * as Knex from "knex";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";


export async function up(knex: Knex): Promise<void> {
        await knex.schema.alterTable(LEVEL_CODE_TABLE, (table) => {
            table.string('learningMore');
        });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(LEVEL_CODE_TABLE, (table) => {
        table.dropColumn('learningMore');
    });
}


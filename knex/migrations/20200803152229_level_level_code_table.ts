import * as Knex from "knex";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('level_level_code');
    if (!hasTable) {
        await knex.schema.createTable('level_level_code', (table) => {
            setUTF8Table(table);
            table.integer('levelId').unsigned().notNullable()
            table.string('levelCodeId', 30).notNullable()
            table.primary(['levelId', 'levelCodeId']);

            table.foreign('levelId').references('level.id').onDelete("CASCADE");
            table.foreign('levelCodeId').references('level_code.id').onDelete("CASCADE");
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('level_level_code');
}


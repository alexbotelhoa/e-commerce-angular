import * as Knex from "knex";
import { LEVEL_LEVEL_CODE_TABLE } from "../../src/entities/level-level-code.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(LEVEL_LEVEL_CODE_TABLE, (table) => {
        setUTF8Table(table);
        table.integer('levelId').unsigned().references('level.id').onDelete("CASCADE");
        table.string('levelCodeId', 30).references('level_code.id').onDelete("CASCADE");
        table.primary(['levelId', 'levelCodeId']);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(LEVEL_LEVEL_CODE_TABLE);
}


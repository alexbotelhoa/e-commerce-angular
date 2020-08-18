import * as Knex from "knex";
import { ENROLLMENT_TABLE } from "../../src/entities/enrollment.entity";
import { USER_TABLE } from "../../src/entities/user.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(ENROLLMENT_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(ENROLLMENT_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id');
            table.integer('userId').unsigned().notNullable().references(`${USER_TABLE}.id`).onDelete('CASCADE');
            table.integer('classId').unsigned().notNullable().references(`${CLASS_TABLE}.id`).onDelete('CASCADE');
            table.index(['userId', 'classId']);
            // add inverted index too to optimize all search cases
            table.index(['classId', 'userId']);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(ENROLLMENT_TABLE);
}


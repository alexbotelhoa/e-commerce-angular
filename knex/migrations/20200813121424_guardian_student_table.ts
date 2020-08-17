import * as Knex from "knex";
import { GUARDIAN_STUDENT_TABLE } from "../../src/entities/guardian-student.entity";
import { USER_TABLE } from "../../src/entities/user.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(GUARDIAN_STUDENT_TABLE, (table) => {
        setUTF8Table(table);
        table.integer('guardianId').unsigned().notNullable().references(`${USER_TABLE}.id`);
        table.integer('studentId').unsigned().references(`${USER_TABLE}.id`);
        table.primary(['guardianId', 'studentId']);
        // add inverted index too to optimize all search cases
        table.index(['studentId', 'guardianId']);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(GUARDIAN_STUDENT_TABLE);
}


import * as Knex from "knex";
import { USER_TABLE } from "../../src/entities/user.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { TEACHER_CLASS_TABLE } from "../../src/entities/teacher-class.entity";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(TEACHER_CLASS_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(TEACHER_CLASS_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id');
            table.integer('teacherId').unsigned().notNullable().references(`${USER_TABLE}.id`).onDelete('CASCADE');
            table.integer('classId').unsigned().notNullable().references(`${CLASS_TABLE}.id`).onDelete('CASCADE');
            table.index(['teacherId', 'classId']);
            // add inverted index too to optimize all search cases
            table.index(['classId', 'teacherId']);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(TEACHER_CLASS_TABLE);
}

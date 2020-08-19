import * as Knex from "knex";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { USER_TABLE } from "../../src/entities/user.entity";
import { ENROLLMENT_TABLE } from "../../src/entities/enrollment.entity";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../src/entities/enrollment-class.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(ENROLLMENT_TABLE);

    await knex.schema.createTable(ENROLLMENT_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.integer('userId').unsigned().notNullable().references(`${USER_TABLE}.id`).onDelete('CASCADE');
        table.integer('levelCodeId').unsigned().notNullable().references(`${LEVEL_CODE_TABLE}.id`).onDelete('CASCADE');
        table.index(['userId', 'levelCodeId']);
        // add inverted index too to optimize all search cases
        table.index(['levelCodeId', 'userId']);
    });

    await knex.schema.createTable(ENROLLMENT_CLASS_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.integer('enrollmentId').unsigned().notNullable().references(`${ENROLLMENT_TABLE}.id`).onDelete('CASCADE');
        table.integer('classId').unsigned().notNullable().references(`${CLASS_TABLE}.id`).onDelete('CASCADE');
        table.index(['enrollmentId', 'classId']);
        // add inverted index too to optimize all search cases
        table.index(['classId', 'enrollmentId']);
    });
}


export async function down(knex: Knex): Promise<void> {
    // drop the newly created enrollment table
    await knex.schema.dropTableIfExists(ENROLLMENT_CLASS_TABLE);
    await knex.schema.dropTableIfExists(ENROLLMENT_TABLE);

    // restore older tables
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


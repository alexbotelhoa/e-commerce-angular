import * as Knex from "knex";
import { LEVEL_CODE_TABLE } from "../../src/entities/level-code.entity";
import { ENROLLMENT_TABLE } from "../../src/entities/enrollment.entity";
import { USER_TABLE } from "../../src/entities/user.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(ENROLLMENT_TABLE, (table) => {
        table.increments('id');
        table.integer('userId').unsigned().notNullable().references(`${USER_TABLE}.id`).onDelete('CASCADE');
        table.integer('classId').unsigned().notNullable().references(`${CLASS_TABLE}.id`).onDelete('CASCADE');
        table.index(['userId', 'classId']);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(ENROLLMENT_TABLE);
}


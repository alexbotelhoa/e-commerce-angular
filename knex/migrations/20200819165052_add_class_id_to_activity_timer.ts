import * as Knex from "knex";
import { ACTIVITY_TIMER_TABLE } from "../../src/entities/activities/activity-timer.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.integer('classId').unsigned().notNullable().references(`${CLASS_TABLE}.id`);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.dropForeign(['classId']);
        table.dropColumn('classId');
    })
}


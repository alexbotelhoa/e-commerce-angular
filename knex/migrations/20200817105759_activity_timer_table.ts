import * as Knex from "knex";
import { ACTIVITY_TIMER_TABLE } from "../../src/entities/activities/activity-timer.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { USER_TABLE } from "../../src/entities/user.entity";
import { CYCLE_ACTIVITY_TABLE } from "../../src/entities/cycle-activity.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(ACTIVITY_TIMER_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id')
        table.integer('userId').unsigned().notNullable().references(`${USER_TABLE}.id`).onDelete("CASCADE");
        table.integer('cycleActivityId').unsigned().notNullable().references(`${CYCLE_ACTIVITY_TABLE}.id`).onDelete("CASCADE");
        table.dateTime('startTime').notNullable().defaultTo(knex.fn.now());
        table.dateTime('completionTime').defaultTo(knex.fn.now());
        table.boolean('completed').defaultTo(false);

        table.index('userId');
        table.index('cycleActivityId');
        // also indexing the completed field for query performance
        table.index('completed');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(ACTIVITY_TIMER_TABLE);
}


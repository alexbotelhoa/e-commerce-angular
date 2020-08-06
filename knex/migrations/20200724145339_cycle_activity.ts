import * as Knex from "knex";
import { CYCLE_ACTIVITY_TABLE } from "../../src/entities/cycle-activity.entity"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists(CYCLE_ACTIVITY_TABLE, (table) => {
        table.increments('id');
        table.integer('order', 3).defaultTo(0);

        table.integer('cycleId').unsigned().notNullable();
        table.integer('activityId').unsigned().notNullable();

        table.foreign('cycleId').references('cycle.id').onDelete('CASCADE');
        table.foreign('activityId').references('activity.id').onDelete('CASCADE');

        table.index('order');
        table.index('cycleId');
        table.index('activityId');

        table.unique(['cycleId', 'activityId']);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(CYCLE_ACTIVITY_TABLE);
}

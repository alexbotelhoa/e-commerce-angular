import * as Knex from "knex";
import { CYCLE_ACTIVITY_TABLE } from "../../src/entities/cycle-activity.entity"
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(CYCLE_ACTIVITY_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(CYCLE_ACTIVITY_TABLE, (table) => {
            setUTF8Table(table);
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
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(CYCLE_ACTIVITY_TABLE);
}
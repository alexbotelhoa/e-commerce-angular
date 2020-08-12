import Knex from "knex";

export function baseActivityTableMigration(table: Knex.CreateTableBuilder): void {
    table.integer('activityId').primary().unsigned().unique();
    table.foreign('activityId').references('activity.id').onDelete('CASCADE');
}

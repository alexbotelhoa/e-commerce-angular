import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('level', (table) => {
        table.increments('id');
        table.string('name', 100).notNullable();
        table.integer('order', 3);
        table.boolean('active').defaultTo(true);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.index('order');
        table.index('active');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('level');
}


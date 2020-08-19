import * as Knex from "knex";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { USER_TABLE } from "../../src/entities/user.entity";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('comment');
    if (!hasTable) {
        await knex.schema.createTable('comment', (table) => {
            setUTF8Table(table);
            table.increments('id').unsigned();
            table.string('text', 2000).notNullable();
            table.integer('userId').unsigned().notNullable().references(`${USER_TABLE}.id`).onDelete('CASCADE');
            table.integer('parentCommentId').unsigned().references(`comment.id`).onDelete('CASCADE');
            table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());

            table.index('createdAt');
            table.index('userId');
            table.index('parentCommentId');
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('comment');
}


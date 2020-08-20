import * as Knex from "knex";
import { ACTIVITY_COMMENT_TABLE } from "../../src/entities/comments/activity-comment.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { USER_TABLE } from "../../src/entities/user.entity";
import { ACTIVITY_TABLE } from "../../src/entities/activity.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(ACTIVITY_COMMENT_TABLE);
    await knex.schema.dropTableIfExists('comment');

    await knex.schema.createTable(ACTIVITY_COMMENT_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id').unsigned();
        table.string('text', 2000).notNullable();
        table.integer('userId').unsigned().notNullable().references(`${USER_TABLE}.id`).onDelete('CASCADE');
        table.integer('activityId').unsigned().notNullable().references(`${ACTIVITY_TABLE}.id`).onDelete('CASCADE');
        table.integer('parentCommentId').unsigned().references(`${ACTIVITY_COMMENT_TABLE}.id`).onDelete('CASCADE');
        table.integer('classId').unsigned().notNullable().references(`${CLASS_TABLE}.id`).onDelete("CASCADE");
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.index('createdAt');
        table.index('userId');
        table.index('parentCommentId');
        table.index('classId');
    });
}


export async function down(knex: Knex): Promise<void> {
    // drop the newly created activity comment table
    await knex.schema.dropTableIfExists(ACTIVITY_COMMENT_TABLE);

    // restore older tables
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

    await knex.schema.createTable(ACTIVITY_COMMENT_TABLE, (table) => {
        setUTF8Table(table);
        // using a weak key to the comment table
        table.integer('commentId').unsigned().notNullable().primary().references(`comment.id`).onDelete("CASCADE");
        table.integer('classId').unsigned().notNullable().references(`${CLASS_TABLE}.id`).onDelete("CASCADE");
        table.index('classId');
    });
}


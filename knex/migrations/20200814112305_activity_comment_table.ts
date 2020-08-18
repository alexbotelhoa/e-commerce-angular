import * as Knex from "knex";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { ACTIVITY_COMMENT_TABLE } from "../../src/entities/comments/activity-comment.entity";
import { COMMENT_TABLE } from "../../src/entities/comments/comment.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(ACTIVITY_COMMENT_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(ACTIVITY_COMMENT_TABLE, (table) => {
            setUTF8Table(table);
            // using a weak key to the comment table
            table.integer('commentId').unsigned().primary().references(`${COMMENT_TABLE}.id`).onDelete("CASCADE");
            table.integer('classId').unsigned().notNullable().references(`${CLASS_TABLE}.id`).onDelete("CASCADE");
            table.index('classId');
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(ACTIVITY_COMMENT_TABLE);
}


import * as Knex from "knex";
import { ANNOTATION_TABLE } from "../../src/entities/annotation.entity";
import { MEETING_TABLE } from "../../src/entities/meeting.entity";
import { USER_TABLE } from "../../src/entities/user.entity";



export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(ANNOTATION_TABLE, (table) => {
        table.increments('id');
        table.date("updatedDate");
        table.date("createdDate");
        table.text("data");
        table.integer('meetingId').unsigned().references(`${MEETING_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');

    });
    await knex.schema.alterTable(ANNOTATION_TABLE, table => {
        table.string('userId', 36);
        table.foreign('userId').references(`${USER_TABLE}.id`).onDelete('CASCADE');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(ANNOTATION_TABLE);

}


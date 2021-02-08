import * as Knex from "knex";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { MEETING_TABLE } from "../../src/entities/meeting.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTableIfNotExists(MEETING_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('objetive', 255);
        table.string('startHour', 10);
        table.string('endHour', 10);
        table.string('classId', 36).references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        table.date('date').index();

    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(MEETING_TABLE);

}


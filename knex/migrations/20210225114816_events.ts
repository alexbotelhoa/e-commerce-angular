import * as Knex from "knex";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { EVENT_ADRESS_TABLE } from "../../src/entities/event-adress.entity";
import { EVENT_INFO_TABLE } from "../../src/entities/event-info.entity";
import { EVENT_INSTRUCTOR_TABLE } from "../../src/entities/event-instructor.entity";
import { EVENT_TABLE } from "../../src/entities/event.entity";
import { USER_TABLE } from "../../src/entities/user.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTableIfNotExists(EVENT_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('classId', 36);
        table.string('userId', 36).references(`${USER_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        table.string('periodId', 100);
        table.string('sessionId', 100);
        table.date('startDate');
        table.date('endDate');
        table.string('vacancies', 100);
        table.string('enrolled', 100);
        table.string('subject', 100);
        table.string('daysOfWeekSchedule', 100);
        table.string('status', 100);
        table.string('teacherConclusion', 100);
        table.string('career', 100);
        table.string('zoomRoom', 100);
        table.string('link', 100);
        table.string('typeFaceToFace', 100);
        table.string('category', 100);
        table.string('statusEnrollment', 100);
    });

    await knex.schema.createTable(EVENT_INSTRUCTOR_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('name', 100);
        table.string('macId', 100);
        table.string('macPass', 100);
        table.index('name');
        table.integer('eventId').unsigned().references(`${EVENT_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    await knex.schema.createTable(EVENT_INFO_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('crseId', 100);
        table.string('crseOfferNbr', 100);
        table.string('strm', 100);
        table.string('sessionCode', 100);
        table.string('classSection', 100);
        table.string('classMtgNbr', 100);
        table.string('facilityId', 100);
        table.string('meetingStartTime', 100);
        table.string('meetingEndTime', 100);
        table.string('mon', 100);
        table.string('tues', 100);
        table.string('wed', 100);
        table.string('thurs', 100);
        table.string('fri', 100);
        table.string('sat', 100);
        table.string('sun', 100);
        table.string('startDate', 100);
        table.string('endDate', 100);
        table.string('classId', 36);
        table.string('userId', 36).references(`${USER_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        table.integer('eventId').unsigned().references(`${EVENT_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    await knex.schema.createTable(EVENT_ADRESS_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('street', 100);
        table.string('number', 100);
        table.string('complement', 100);
        table.string('district', 100);
        table.string('postalCode', 100);
        table.string('city', 100);
        table.string('state', 100);
        table.integer('eventId').unsigned().references(`${EVENT_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(EVENT_ADRESS_TABLE);
    await knex.schema.dropTableIfExists(EVENT_INSTRUCTOR_TABLE);
    await knex.schema.dropTableIfExists(EVENT_INFO_TABLE);
    await knex.schema.dropTableIfExists(EVENT_TABLE);

}


import * as Knex from "knex";
import { ENROLLMENT_CLASS_TABLE } from "../../src/entities/enrollment-class.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        DELETE enrollment_class 
            FROM enrollment_class
            LEFT JOIN enrollment 
            ON enrollment_class.enrollmentId = enrollment.id
            WHERE enrollment.id IS null
    `)
    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.foreign('enrollmentId').references('enrollment.id').onDelete("CASCADE");
    });
}


export async function down(knex: Knex): Promise<void> {
}


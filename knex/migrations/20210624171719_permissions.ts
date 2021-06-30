import * as Knex from "knex";
import { CARRER_TABLE } from "../../src/entities/carrer.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../src/entities/enrollment-class.entity";
import { PERMISSION_TABLE } from "../../src/entities/permission.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(CARRER_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('carrerId').index().unique();
        table.boolean('active').defaultTo(true);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    });

    await knex.schema.createTable(PERMISSION_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('carrerId');
        table.string('name');
        table.boolean('active').defaultTo(true);
        table.integer('carrer').unsigned().references(`${CARRER_TABLE}.id`).onDelete('CASCADE');
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(CARRER_TABLE);
    await knex.schema.dropTableIfExists(PERMISSION_TABLE);
}


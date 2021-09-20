import * as Knex from "knex";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { MATERIAL_TABLE } from "../../src/entities/material.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(MATERIAL_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('userId', 36).notNullable();
        table.string('classId', 36).references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        table.string("isbn");
        table.string("author");
        table.string("title");
        table.string("publisher");
        table.string("coverImg");
        table.string("isInternal").defaultTo(false);
        table.boolean("active").defaultTo(true);
        table.boolean("acquiredLanguageBooster").notNullable();
        table.string('createdAt').notNullable().defaultTo(new Date().toLocaleString("en-US", {
                        timeZone: "America/Sao_Paulo"
                    }));
        table.string('updatedAt').notNullable().defaultTo(new Date().toLocaleString("en-US", {
                        timeZone: "America/Sao_Paulo"
                    }));

    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(MATERIAL_TABLE);

}


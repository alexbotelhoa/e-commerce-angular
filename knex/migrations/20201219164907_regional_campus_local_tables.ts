import * as Knex from "knex";
import { CAMPUS_TABLE } from "../../src/entities/campus.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { LOCAL_TABLE } from "../../src/entities/local.entity";
import { REGIONAL_TABLE } from "../../src/entities/regional.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    // adiciona tabela de regiao
    await knex.schema.createTable(REGIONAL_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('description', 100);
        table.string('name', 50);
        table.index('name');

    });
    // adiciona tabela de campus

    await knex.schema.createTable(CAMPUS_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('description', 100);
        table.string('name', 50);
        table.index('name');
        table.integer('regionalId').unsigned().references(`${REGIONAL_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    // adiciona tabela de local
    await knex.schema.createTable(LOCAL_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('description', 100);
        table.string('name', 50);
        table.index('name');
        table.integer('campusId').unsigned().references(`${CAMPUS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    // adiciona compos na tabela de classe
    await knex.schema.alterTable(CLASS_TABLE, (table) => {
        table.integer('regionalId').unsigned().references(`${REGIONAL_TABLE}.id`).onUpdate('CASCADE');
        table.integer('campusId').unsigned().references(`${CAMPUS_TABLE}.id`).onUpdate('CASCADE');
        table.integer('localId').unsigned().references(`${LOCAL_TABLE}.id`).onUpdate('CASCADE');

    });
}


export async function down(knex: Knex): Promise<void> {


    await knex.schema.alterTable(CLASS_TABLE, (table) => {
        table.dropForeign(['regionalId']);
        table.dropForeign(['campusId']);
        table.dropForeign(['localId']);
        table.dropColumn('regionalId');
        table.dropColumn('campusId');
        table.dropColumn('localId');
    });
    await knex.schema.dropTableIfExists(LOCAL_TABLE);
    await knex.schema.dropTableIfExists(CAMPUS_TABLE);
    await knex.schema.dropTableIfExists(REGIONAL_TABLE);
}


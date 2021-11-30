import * as Knex from "knex";
import { BACKUP_TABLE } from "../../src/entities/backup.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(BACKUP_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(BACKUP_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id');
            table.string('name');
            table.string('type');
            table.json("data");
            table.string('createdAt').notNullable().defaultTo(new Date().toLocaleString("en-US", {
                timeZone: "America/Sao_Paulo"
            }));
table.string('updatedAt').notNullable().defaultTo(new Date().toLocaleString("en-US", {
                timeZone: "America/Sao_Paulo"
            }));
        });
    }
}


export async function down(knex: Knex): Promise<void> {
}


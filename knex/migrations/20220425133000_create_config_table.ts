import * as Knex from "knex";
import { CONFIG_TABLE } from "../../src/entities/config.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('config');
  if (!hasTable) {
    await knex.schema.createTable(CONFIG_TABLE, (table) => {
      setUTF8Table(table);
      table.increments('id');
      table.text('chatMsgBeforeQuestion', 'mediumtext');
      table.text('chatMsgAfterQuestion', 'mediumtext');
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
      table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
    });
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(CONFIG_TABLE);
}

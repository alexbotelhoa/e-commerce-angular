import * as Knex from "knex";
import { USER_TABLE } from "../../src/entities/user.entity";
import { CHAT_TABLE } from '../../src/entities/chat.entity';
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('chat');
  if (!hasTable) {
    await knex.schema.createTable(CHAT_TABLE, (table) => {
      setUTF8Table(table);
      table.increments('id');
      table.string('userId', 36).notNullable();
      table.string('firstMessage', 100).notNullable();
      table.string('dateMessage', 30).notNullable();
      table.integer('amountMessage', 2).defaultTo(0);
      table.boolean('isRead').defaultTo(false);      
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
      table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
    });
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(CHAT_TABLE);
}

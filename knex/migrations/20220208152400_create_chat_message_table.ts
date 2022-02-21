import * as Knex from "knex";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { CHAT_MESSAGE_TABLE } from "../../src/entities/chat-message.entity";


export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('chat_message');
  if (!hasTable) {
    await knex.schema.createTable(CHAT_MESSAGE_TABLE, (table) => {
      setUTF8Table(table);
      table.increments('id');
      table.string('userId', 36).notNullable();
      table.boolean('isEtutor').defaultTo(false);
      table.integer('levelCodeId');
      table.string('levelCodeName', 100);
      table.integer('levelThemeId');
      table.string('levelThemeName', 100);
      table.integer('cycleActivityId');
      table.string('cycleActivityName', 100);
      table.string('activityName', 100);
      table.text('message', 'mediumtext').notNullable();
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
      table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
    });
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(CHAT_MESSAGE_TABLE);
}

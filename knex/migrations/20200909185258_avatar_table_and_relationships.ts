import * as Knex from "knex";
import { setUTF8Table } from "../utils/set-utf8-table.migration";
import { AVATAR_TABLE } from "../../src/entities/avatar.entity";
import { USER_TABLE } from "../../src/entities/user.entity";
import { insertAvatar } from "../../src/shared/repositories/avatar.repository";
import { avatarsData } from "../seeds/data/avatars.data";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(AVATAR_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(AVATAR_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id').unsigned().primary();
            table.string('name', 100).notNullable();
            table.string('extension', 10).notNullable();
        });
        await knex.schema.alterTable(USER_TABLE, (table) => {
            table.integer('avatarId').unsigned().references(`${AVATAR_TABLE}.id`);
        });

        await insertAvatar(knex)(avatarsData);
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(USER_TABLE, table => {
        table.dropForeign(['avatarId']);
        table.dropColumn('avatarId');
    });
    await knex.schema.dropTableIfExists(AVATAR_TABLE);
}


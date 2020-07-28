import * as Knex from "knex";
import { USER_ROLE_TABLE } from "../../src/entities/user-role.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(USER_ROLE_TABLE, (table) => {
        table.increments('id');
        table.integer('userId').unsigned().notNullable();
        table.integer('roleId', 2).unsigned().notNullable();
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.index('userId');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(USER_ROLE_TABLE);
}


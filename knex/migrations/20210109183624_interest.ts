import * as Knex from "knex";
import { INTEREST_TABLE } from "../../src/entities/interest.entity";
import { USER_INTEREST_TABLE } from "../../src/entities/user-interest.entity";
import { USER_TABLE } from "../../src/entities/user.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTableIfNotExists(INTEREST_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.string('name', 50);
        table.index('name');
    });

    await knex.schema.createTableIfNotExists(USER_INTEREST_TABLE, (table) => {
        setUTF8Table(table);
        table.increments('id');
        table.integer('order', 9);
        table.integer('interestId').unsigned().references(`${INTEREST_TABLE}.id`);
        table.string('userId', 36).notNullable().references(`${USER_TABLE}.id`).onDelete('CASCADE');
    });
    await knex(INTEREST_TABLE).insert([
        { "name": "Architecture" },
        { "name": "Astrology" },
        { "name": "games" },
        { "name": "Cartoons" },
        { "name": "Coding" },
        { "name": "Collectibles" },
        { "name": "Conversation" },
        { "name": "Dance" },
        { "name": "Decoration" },
        { "name": "DIY" },
        { "name": "Drawing" },
        { "name": "Ecology" },
        { "name": "Economy" },
        { "name": "News" },
        { "name": "Family" },
        { "name": "Fashion" },
        { "name": "Gastronomy" },
    ]);

}


export async function down(knex: Knex): Promise<void> {

    // await knex.schema.alterTable(USER_INTEREST_TABLE, (table) => {
    //     table.dropForeign(['interestId']);
    //     table.dropColumn('interestId');
    // });
    await knex.schema.dropTableIfExists(USER_INTEREST_TABLE);
    await knex.schema.dropTableIfExists(INTEREST_TABLE);
}


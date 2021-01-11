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
        { "name": "adventure" },
        { "name": "architecture" },
        { "name": "astrology" },
        { "name": "board games" },
        { "name": "cars" },
        { "name": "cartoons" },
        { "name": "coding" },
        { "name": "collectibles" },
        { "name": "conversation" },
        { "name": "dance" },
        { "name": "decoration" },
        { "name": "DIY" },
        { "name": "drawing" },
        { "name": "ecology" },
        { "name": "economy" },
        { "name": "news" },
        { "name": "family" },
        { "name": "fashion" },
        { "name": "gastronomy" },
        { "name": "handicraft" },
        { "name": "health" },
        { "name": "home improvement" },
        { "name": "languages" },
        { "name": "learning" },
        { "name": "literature" },
        { "name": "make up" },
        { "name": "miniatures" },
        { "name": "movies and TV" },
        { "name": "music" },
        { "name": "organization" },
        { "name": "painting" },
        { "name": "party" },
        { "name": "pets" },
        { "name": "photography" },
        { "name": "podcasts" },
        { "name": "science fiction" },
        { "name": "sculpture" },
        { "name": "social media" },
        { "name": "sports" },
        { "name": "theatre" },
        { "name": "traveling" },
        { "name": "video games" },
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


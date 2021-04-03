import * as Knex from "knex";
import { NEWSLETTER_TABLE } from "../../src/entities/newsletter.entity";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(NEWSLETTER_TABLE, (table) => {
        table.string('imgSrc');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(NEWSLETTER_TABLE, (table) => {
        table.dropColumn('imgSrc');
    });
}


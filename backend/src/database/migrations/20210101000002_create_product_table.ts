import * as Knex from "knex";
import { CATEGORY_TABLE } from "../../entities/category.entity";
import { PRODUCT_TABLE } from "../../entities/product.entity";
import { setUTF8Table } from "../utils/set-utf8-table.migration";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable(PRODUCT_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(PRODUCT_TABLE, (table) => {
            setUTF8Table(table);
            table.increments('id').primary();
            table.string('name', 200).notNullable();
            table.integer('price', 100).notNullable();

            table.integer('categoryId').unsigned().notNullable();
            table.foreign('categoryId').references(`${CATEGORY_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');

            table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(PRODUCT_TABLE);
}

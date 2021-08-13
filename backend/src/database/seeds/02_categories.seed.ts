import * as Knex from "knex";
import { deleteAllCategories, insertCategory } from "../../shared/repositories/category.repository";
import { categoriesData } from "./data/category.data";

export async function seed(knex: Knex): Promise<void> {
    await deleteAllCategories(knex);

    await insertCategory(knex)(categoriesData);
}

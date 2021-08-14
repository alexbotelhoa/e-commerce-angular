import * as Knex from "knex";

import { categoriesData } from "./data/category.data";
import { deleteAllCategories, insertCategory } from "../../shared/repositories/category.repository";

export async function seed(knex: Knex): Promise<void> {
    await deleteAllCategories(knex);

    await insertCategory(knex)(categoriesData);
}

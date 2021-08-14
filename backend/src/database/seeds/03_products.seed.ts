import * as Knex from "knex";

import { productsData } from "./data/product.data";
import { deleteAllProducts, insertProduct } from "../../shared/repositories/product.repository";

export async function seed(knex: Knex): Promise<void> {
    await deleteAllProducts(knex);

    await insertProduct(knex)(productsData);
}

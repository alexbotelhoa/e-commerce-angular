import * as Knex from "knex";
import { deleteAllProducts, insertProduct } from "../../shared/repositories/product.repository";
import { productsData } from "./data/product.data";

export async function seed(knex: Knex): Promise<void> {
    await deleteAllProducts(knex);

    await insertProduct(knex)(productsData);
}


import * as Knex from "knex";
import { deleteAllLevelCodes, insertLevelCode } from "../../src/shared/repositories/level-code.repository";
import { levelCodesData } from "../seeds/data/level-codes.data";


export async function up(knex: Knex): Promise<void> {
    await insertLevelCode(knex)(levelCodesData);
}


export async function down(knex: Knex): Promise<void> {
    try {
        await deleteAllLevelCodes(knex);
    } catch (err) {
        console.log('Erro dropping level codes: ', err);
    }
}


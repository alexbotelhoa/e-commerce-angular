import * as Knex from "knex";
import { deleteAllAvatars, insertAvatar } from "../../src/shared/repositories/avatar.repository";
import { avatarsData } from "./data/avatars.data";


export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllAvatars(knex);

    // Inserts seed entries
    await insertAvatar(knex)(avatarsData);
}


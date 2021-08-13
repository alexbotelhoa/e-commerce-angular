import * as Knex from "knex";
import { deleteAllUsers, insertUser } from "../../shared/repositories/user.repository";
import { usersData } from "./data/user.data";

export async function seed(knex: Knex): Promise<void> {
    await deleteAllUsers(knex);

    await insertUser(knex)(usersData);
}

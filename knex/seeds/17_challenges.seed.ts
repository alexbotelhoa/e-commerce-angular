import * as Knex from "knex";
import { deleteAllChallenges, insertChallenge } from "../../src/shared/repositories/challenge.repository";
import { challengesData } from "./data/challenges.data";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllChallenges(knex);

    // Inserts seed entries
    await insertChallenge(knex)(challengesData);
}


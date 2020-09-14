import * as Knex from "knex";
import { insertChallenge, deleteChallenge } from "../../src/shared/repositories/challenge.repository";
import { challengesData } from "../seeds/data/challenges.data";

export async function up(knex: Knex<any, any>): Promise<void> {
    await insertChallenge(knex)(challengesData);
}

export async function down(knex: Knex<any, any>): Promise<void> {
    await deleteChallenge(knex)(builder => builder.whereIn('id', challengesData.map(challenge => challenge.id)));
}


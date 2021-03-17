import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex('avatar').update({ name: "Agatha" }).where('name', "Aghata");
    await knex('avatar').update({ name: "Henry" }).where('name', "Henrique VIII");
    await knex('avatar').update({ name: "Lion" }).where('name', "Leão");
    await knex('avatar').update({ name: "Lioness" }).where('name', "Leoa");
    await knex('avatar').update({ name: "Henry" }).where('name', "Henrique VIII");
    await knex('avatar').update({ name: "Lion" }).where('name', "Leoa");
    await knex('avatar').update({ name: "Beth" }).where('name', "Rainha Elizabeth");
    await knex('avatar').update({ name: "Henry" }).where('name', "Henrique VIII");
    await knex('avatar').update({ name: "Nelson" }).where('name', "Seaman");
}


export async function down(knex: Knex): Promise<void> {
}
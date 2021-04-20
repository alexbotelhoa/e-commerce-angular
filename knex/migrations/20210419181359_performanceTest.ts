import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex('user').update({ macId: '00611709929', macPass: 'GIQ1647' }).where('id', '1166199');
}


export async function down(knex: Knex): Promise<void> {
}


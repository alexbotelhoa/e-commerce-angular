import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex('class').update({ institutionId: 'ACISP', periodId: '2202', carrerId: 'ENTR', sessionId: '200', startDate: '2020-08-31', endDate: '2020-12-21' }).where('id', '11891');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2202', carrerId: 'ENTR', sessionId: '200', startDate: '2020-08-31', endDate: '2020-12-21' }).where('id', '11823');
}


export async function down(knex: Knex): Promise<void> {
}


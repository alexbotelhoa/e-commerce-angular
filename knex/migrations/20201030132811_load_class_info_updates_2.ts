import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex('class').update({ institutionId: 'ACISP', periodId: '2202', carrerId: 'CULT', sessionId: '200', startDate: '2020-08-31', endDate: '2020-12-21' }).where('id', '13242');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2202', carrerId: 'CULT', sessionId: '200', startDate: '2020-08-31', endDate: '2020-12-21' }).where('id', '13839');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2202', carrerId: 'CULT', sessionId: '200', startDate: '2020-09-01', endDate: '2020-12-15' }).where('id', '12762');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2202', carrerId: 'CULT', sessionId: '200', startDate: '2020-08-31', endDate: '2020-12-21' }).where('id', '15213');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2202', carrerId: 'CULT', sessionId: '200', startDate: '2020-08-31', endDate: '2020-12-21' }).where('id', '17087');
}

export async function down(knex: Knex): Promise<void> {
}


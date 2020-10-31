import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex('class').update({ institutionId: 'ACISP', periodId: '2191', carrerId: 'CULT', sessionId: '100', startDate: '2019-01-01', endDate: '2019-06-30' }).where('id', '601');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2191', carrerId: 'CULT', sessionId: '200', startDate: '2019-02-08', endDate: '2019-06-28' }).where('id', '936');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2191', carrerId: 'CULT', sessionId: '200', startDate: '2019-02-08', endDate: '2019-06-28' }).where('id', '937');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2191', carrerId: 'CULT', sessionId: '200', startDate: '2019-04-05', endDate: '2019-08-31' }).where('id', '1189');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'CULT', sessionId: '200', startDate: '2019-08-03', endDate: '2019-12-07' }).where('id', '4906');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'CULT', sessionId: '200', startDate: '2019-08-03', endDate: '2019-12-07' }).where('id', '4906');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'CULT', sessionId: '200', startDate: '2019-08-08', endDate: '2019-11-26' }).where('id', '5014');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'CULT', sessionId: '100', startDate: '2019-07-01', endDate: '2019-07-26' }).where('id', '5749');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'CULT', sessionId: '200', startDate: '2019-09-11', endDate: '2019-10-30' }).where('id', '5845');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'EVCL', sessionId: '200', startDate: '2019-07-01', endDate: '2019-12-11' }).where('id', '5994');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'CULT', sessionId: '200', startDate: '2019-09-23', endDate: '2020-02-28' }).where('id', '6045');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'EVCL', sessionId: '200', startDate: '2019-08-09', endDate: '2019-11-29' }).where('id', '6274');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'CULT', sessionId: '200', startDate: '2019-08-17', endDate: '2019-12-14' }).where('id', '6473');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2192', carrerId: 'CULT', sessionId: '200', startDate: '2019-10-09', endDate: '2019-12-04' }).where('id', '6574');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'ENTR', sessionId: '200', startDate: '2020-03-02', endDate: '2020-08-20' }).where('id', '6792');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'ENTR', sessionId: '200', startDate: '2020-03-02', endDate: '2020-08-20' }).where('id', '7533');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'CULT', sessionId: '200', startDate: '2020-03-02', endDate: '2020-08-24' }).where('id', '8378');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'ENTR', sessionId: '200', startDate: '2020-02-15', endDate: '2020-08-01' }).where('id', '10164');
    await knex('class').update({ institutionId: 'ACISP' }).where('id', '11001');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'CULT', sessionId: '200', startDate: '2020-01-01', endDate: '2020-06-30' }).where('id', '11002');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2202', carrerId: 'ENTR', sessionId: '200', startDate: '2020-09-05', endDate: '2020-12-19' }).where('id', '11688');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'EVCL', sessionId: '200', startDate: '2020-03-05', endDate: '2020-08-31' }).where('id', '16472');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'EVCL', sessionId: '200', startDate: '2020-03-04', endDate: '2020-08-31' }).where('id', '17122');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'EVCL', sessionId: '200', startDate: '2020-03-06', endDate: '2020-08-22' }).where('id', '17266');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2201', carrerId: 'EVCL', sessionId: '200', startDate: '2020-03-09', endDate: '2020-08-31' }).where('id', '17581');
    await knex('class').update({ institutionId: 'ACISP' }).where('id', '21001');
    await knex('class').update({ institutionId: 'ACISP' }).where('id', '21002');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2182', carrerId: 'CULT', sessionId: '200', startDate: '2018-05-01', endDate: '2018-12-31' }).where('id', '211146');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2182', carrerId: 'CULT', sessionId: '100', startDate: '2018-05-01', endDate: '2018-12-31' }).where('id', '211295');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2182', carrerId: 'CULT', sessionId: '200', startDate: '2018-05-01', endDate: '2018-12-31' }).where('id', '216184');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2191', carrerId: 'CULT', sessionId: '200', startDate: '2019-02-28', endDate: '2019-06-27' }).where('id', '219632');
    await knex('class').update({ institutionId: 'ACISP', periodId: '2191', carrerId: 'CULT', sessionId: '200', startDate: '2019-02-26', endDate: '2019-06-25' }).where('id', '221681');
}


export async function down(knex: Knex): Promise<void> {
}


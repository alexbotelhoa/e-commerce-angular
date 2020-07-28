import knex from 'knex';
import { DatabaseConfiguration } from '../constants/configuration.constant';

export const databaseServiceFactory = (config: DatabaseConfiguration): knex => knex({
    client: config.client,
    connection: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.name,
    },
    debug: true,
});

export type DatabaseService<TRecord = any, TResult = any> = knex<TRecord, TResult>;

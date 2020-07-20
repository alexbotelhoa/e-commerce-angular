import knex from 'knex';
import { DatabaseConfiguration, databaseConfiguration } from '../constants/configuration.constant';
import Knex from 'knex';

export const databaseServiceFactory = (config: DatabaseConfiguration): Knex => knex({
    client: config.client,
    connection: {
        host : config.host,
        user : config.user,
        password : config.password,
        database : config.name,
    }
});

export type DatabaseService<TRecord = any, TResult = any> = knex<TRecord, TResult>;

export const databaseService: DatabaseService = databaseServiceFactory(databaseConfiguration);

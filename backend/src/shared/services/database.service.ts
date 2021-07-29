import knex from 'knex';
import { FastifyLoggerInstance } from 'fastify';
import { DatabaseConfiguration } from '../constants/configuration.constant';

export const databaseServiceFactory = (config: DatabaseConfiguration, log: FastifyLoggerInstance): knex => knex({
    client: config.client,
    connection: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.name,
    },
    debug: true,
    log: {
        error: (message) => log.error(message, "KNEX ERROR"),
        warn: (message) => log.warn(message, "KNEX WARN"),
        debug: (message) => log.debug(message, "KNEX DEBUG"),
        enableColors: true,
    },
});

export type DatabaseService<TRecord = any, TResult = any> = knex<TRecord, TResult>;

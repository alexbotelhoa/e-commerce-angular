import Knex from "knex";

import { environmentFactory } from "./src/shared/services/environment.service";
import { databaseConfigurationFromEnvironment } from "./src/shared/constants/configuration.constant";

const environment = environmentFactory();

const databaseConfig = databaseConfigurationFromEnvironment(environment);

const connection: Knex.Config = {
  client: databaseConfig.client,
  connection: {
    host: databaseConfig.host,
    database: databaseConfig.name,
    user: databaseConfig.user,
    password: databaseConfig.password
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'migrations',
    directory: './knex/migrations',
  },
  seeds: {
    directory: './knex/seeds',
  },
  debug: true,
}

console.log(`Migration config: ${JSON.stringify(connection)}`);

export const knexFile = connection;
export const development = connection;
export const production = connection;

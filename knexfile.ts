import Knex from "knex";

import dotenv from 'dotenv';

dotenv.config();

const connection: Knex.Config = {
  client: process.env.DB_CLIENT,
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
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
}

module.exports = {
  development: connection,
  production: connection,
};

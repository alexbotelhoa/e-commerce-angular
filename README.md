# portal-server

Backend for Cultura Inglesa's activity portal

## Stack and libs

- NodeJS
- Typescript
- Knex
- fastify
- fastify-gql

## Starting the project

- copy file `.env.local` to `.env` to setup the local environment variables
- npm install / yarn install
- npm run watch

## GraphQL Codegen

This project uses GraphQL CodeGenerator to automatically generate types for all resolvers needed. The generated file is located in ./src/resolvers-types.ts and shouldn't be edited manually.

- `npm run codegen` to run the utility once
- `npm run codegen:watch` to run the utility whenever config or files change

## Migrations

Migrations are located in the /knex/migrations folder

- Use `npm run migration:make {migrationName}` to create a new database migration
- Use `npm run migrate` to run all migrations up to latest
- Install the knex cli for more commands: `npm i -g knex`

## Seeding the database

Seeds are located in the /knex/seeds folder

- Use `npm run seed:make {seedName}` to create a new database seed
- Use `npm run seed:run` to seed the database with all seeds (**WARNING**: this will probably delete all existing data and replace with seed)
- Install the knex cli for more commands: `npm i -g knex`

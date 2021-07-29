import { Environment } from "../types/environment.type";

export interface DatabaseConfiguration {
    readonly client: string;
    readonly host: string;
    readonly name: string;
    readonly user: string;
    readonly password: string;
}

export const databaseConfigurationFromEnvironment = (env: Environment): DatabaseConfiguration => ({
    client: env.DB_CLIENT,
    host: env.DB_HOST,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
})

export const readonlyDatabaseConfigurationFromEnvironment = (env: Environment): DatabaseConfiguration => ({
    client: env.DB_CLIENT,
    host: env.DB_READONLY_HOST,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
})

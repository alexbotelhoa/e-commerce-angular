import dotenv from 'dotenv';
dotenv.config();

export interface DatabaseConfiguration {
    readonly client: string;
    readonly host: string;
    readonly name: string;
    readonly user: string;
    readonly password: string;
}

export const databaseConfiguration: DatabaseConfiguration = {
    client: process.env.DB_CLIENT!,
    host: process.env.DB_HOST!,
    name: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
}

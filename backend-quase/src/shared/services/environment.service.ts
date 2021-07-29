import dotenv from 'dotenv';
import { Environment } from '../types/environment.type';

dotenv.config({
    debug: true,
});

export const environmentFactory = (): Environment => {
    const DB_HOST = getEnvironmentVariable('DB_HOST');
    const DB_READONLY_HOST = getEnvironmentVariable('DB_READONLY_HOST');

    const environment: Environment = {
        DB_HOST: DB_HOST,
        DB_READONLY_HOST: DB_READONLY_HOST,
        DB_PORT: getEnvironmentVariable('DB_PORT'),
        DB_USER: getEnvironmentVariable('DB_USER'),
        DB_PASSWORD: JSON.parse(getEnvironmentVariable('DB_PASSWORD')).password,
        DB_CLIENT: getEnvironmentVariable('DB_CLIENT'),
        DB_NAME: getEnvironmentVariable('DB_NAME'),
        JWT_SECRET: getEnvironmentVariable('JWT_SECRET'),
        PRODUCTION: DB_HOST !== 'localhost',
        REDIS_HOST: getEnvironmentVariable('REDIS_HOST'),
        REDIS_PORT: getEnvironmentVariable('REDIS_PORT'),
    };

    return environment;
}

export function getEnvironmentVariable(variable: string): string {
    const value = process.env[variable];
    if (!value) {
        throw new Error(`Environment variable '${variable}' not set.`);
    }
    return value;
}

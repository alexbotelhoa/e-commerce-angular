import dotenv from 'dotenv';
import { Environment } from '../types/environment.type';

dotenv.config({
    debug: true,
});

export const environmentFactory = (): Environment => {

    const environment: Environment = {
        DB_HOST: getEnvironmentVariable('DB_HOST'),
        DB_PORT: getEnvironmentVariable('DB_PORT'),
        DB_USER: getEnvironmentVariable('DB_USER'),
        DB_PASSWORD: JSON.parse(getEnvironmentVariable('DB_PASSWORD')).password,
        DB_CLIENT: getEnvironmentVariable('DB_CLIENT'),
        DB_NAME: getEnvironmentVariable('DB_NAME'),
        JWT_SECRET: getEnvironmentVariable('JWT_SECRET'),
        CI_PORTAL_URL: getEnvironmentVariable('CI_PORTAL_URL'),
    };

    console.log(environment);

    return environment;
}

export function getEnvironmentVariable(variable: string): string {
    const value = process.env[variable];
    console.log(`env - ${variable}:${value}`);
    if (!value) {
        throw new Error(`Environment variable '${variable}' not set.`);
    }
    return value;
}

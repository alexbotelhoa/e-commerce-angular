export interface Environment {
    DB_HOST: string;
    DB_READONLY_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_CLIENT: string;
    DB_NAME: string;
    JWT_SECRET: string;
    PRODUCTION: boolean;
    REDIS_HOST: string,
    REDIS_PORT: string
}

export interface Environment {
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_CLIENT: string;
    DB_NAME: string;
    JWT_SECRET: string;
    CI_PORTAL_URL: string;
    PRODUCTION: boolean;
    STUDENT_GRADE_INTEGRATION_URL: string,
    STUDENT_GRADE_INTEGRATION_API_KEY: string,
}

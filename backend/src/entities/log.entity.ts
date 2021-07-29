export interface LogEntity {
    id: string;
    body: string;
    key: string;
    status: string;
    createdAt: string;
}

export const LOG_TABLE = 'log';

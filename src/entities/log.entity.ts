export interface LogEntity {
    id: string;
    body: string;
    key: string;
    createdAt: string;
    status: string;
}

export const LOG_TABLE = 'log';

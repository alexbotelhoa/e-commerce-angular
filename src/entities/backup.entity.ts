export interface BackupEntity {
    id: string;
    name: string;
    type?: string;
    createdAt: string;
    updatedAt: string;
    data: Record<string, unknown>;
}

export const BACKUP_TABLE = 'backup';

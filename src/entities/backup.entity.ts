export interface BackupEntity {
    id: string;
    name: string;
    type: string;
    data: string;
    createdAt: string;
    updatedAt: string;
}

export const BACKUP_TABLE = 'backup';

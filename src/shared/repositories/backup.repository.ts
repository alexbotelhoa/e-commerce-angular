import { createRepository } from "../services/repository.service";
import { BackupEntity, BACKUP_TABLE } from "../../entities/backup.entity";

export const {
    getById: getBackupById,
    getManyByIds: getBackupsByIds,
    select: selectBackup,
    insert: insertBackup,
    update: updateBackup,
    delete: deleteBackup,
    deleteAll: deleteAllBackups,
    count: countBackups,
} = createRepository<BackupEntity>(BACKUP_TABLE, 'id');

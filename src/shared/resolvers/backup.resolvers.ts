import { GQLBackupResolvers } from "../../resolvers-types";
import { BackupEntity } from "../../entities/backup.entity";

export const backupEntityResolvers: Pick<GQLBackupResolvers, keyof BackupEntity> = {
    id: (obj) => obj.id,
    name: (obj) => obj.name,
    type: (obj) => obj.type,
    data: (obj) => JSON.stringify(obj.data),
    createdAt: (obj) => obj.createdAt && new Date(obj.createdAt).toISOString(),
    updatedAt: (obj) => obj.updatedAt && new Date(obj.updatedAt).toISOString(),
}

export const backupResolvers: GQLBackupResolvers = {
    ...backupEntityResolvers,
}

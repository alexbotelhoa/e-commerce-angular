import { PermissionEntity, PERMISSION_TABLE } from "../../entities/permission.entity";
import { createRepository } from "../services/repository.service";

export const {
    getById: getPermissionById,
    getManyByIds: getPermissionsByIds,
    select: selectPermission,
    insert: insertPermission,
    update: updatePermission,
    delete: deletePermission,
    deleteAll: deleteAllPermissions,
    count: countPermissions,
} = createRepository<PermissionEntity>(PERMISSION_TABLE, 'id');

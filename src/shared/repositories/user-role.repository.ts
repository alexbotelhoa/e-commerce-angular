import { createRepository } from "../services/repository.service";
import { USER_ROLE_TABLE, UserRoleEntity } from "../../entities/user-role.entity";

export const {
    getById: getUserRoleById,
    getManyByIds: getUserRolesByIds,
    select: selectUserRole,
    insert: insertUserRole,
    update: updateUserRole,
    delete: deleteUserRole,
    deleteAll: deleteAllUserRoles,
    count: countUserRoles,
} = createRepository<UserRoleEntity>(USER_ROLE_TABLE, 'id');

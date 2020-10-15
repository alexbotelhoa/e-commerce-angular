import { RoleId } from "../domain/authorization/enums/role-id.enum";

export interface UserRoleEntity {
    id: number;
    userId: string;
    roleId: RoleId;
}

export const USER_ROLE_TABLE = 'user_role';

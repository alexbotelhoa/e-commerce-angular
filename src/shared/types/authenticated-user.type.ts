import { PermissionMap } from "../../domain/authorization/types/permission-map.type";
import { RoleId } from "../../domain/authorization/enums/role-id.enum";
import { Role } from "../../domain/authorization/types/role.type";

export interface AuthenticatedUser {
    id: number;
    roleIds: RoleId[];
    roles: Role[];
    permissionMap: PermissionMap;
}

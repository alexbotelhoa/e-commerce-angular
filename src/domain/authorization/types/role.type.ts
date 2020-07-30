import { RoleId } from "../enums/role-id.enum";
import { PermissionMap } from "./permission-map.type";

export interface Role {
    readonly id: RoleId;
    readonly name: string;
    readonly permissionMap: PermissionMap;
}

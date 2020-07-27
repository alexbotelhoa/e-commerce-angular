import { Role } from "../types/role.type";
import { RoleId } from "../enums/role-id.enum";
import { objectKeys } from "../../../shared/utils/typed-object-keys.util";

export const adminRole: Role = {
    id: RoleId.ADMIN,
    permissionMap: {
        MANAGE_ACTIVITY: true,
        MANAGE_CYCLE: true,
        MANAGE_LEVEL: true,
        MANAGE_THEME: true,
    }
}

export const studentRole: Role = {
    id: RoleId.STUDENT,
    permissionMap: {
        EXECUTE_ACTIVITY: true,
    }
}

export const teacherRole: Role = {
    id: RoleId.TEACHER,
    permissionMap: {
        EXECUTE_ACTIVITY: true,
    }
}

export const rolesById: Readonly<Record<RoleId, Role>> = {
    [RoleId.ADMIN]: adminRole,
    [RoleId.STUDENT]: studentRole,
    [RoleId.TEACHER]: teacherRole,
};

export const rolesList: ReadonlyArray<Role> = objectKeys(rolesById)
    .reduce<Role[]>((acc, key) => {
        const role = getRoleById(key);
        acc.push(role);
        return acc;
    }, []);

export function getRoleById(id: RoleId): Role {
    return rolesById[id];
}
import { PermissionId } from "../enums/permission-id.enum";
import { Permission } from "../types/permission.type";
import { objectKeys } from "../../../shared/utils/typed-object-keys.util";

export const permissionsById: Record<PermissionId, Permission> = {
    MANAGE_ACTIVITY: {
        id: 'MANAGE_ACTIVITY',
        name: 'Manage activity',
        description: 'User can view, create, edit, enable/disable and delete activities.',
    },
    MANAGE_CYCLE: {
        id: 'MANAGE_CYCLE',
        name: 'Manage cycle',
        description: 'User can view, create, edit, enable/disable and delete cycles.',
    },
    MANAGE_LEVEL: {
        id: 'MANAGE_LEVEL',
        name: 'Manage level',
        description: 'User can view, create, edit, enable/disable and delete levels.',
    },
    MANAGE_THEME: {
        id: 'MANAGE_THEME',
        name: 'Manage theme',
        description: 'User can view, create, edit, enable/disable and delete themes.',
    },
    EXECUTE_ACTIVITY: {
        id: 'EXECUTE_ACTIVITY',
        name: 'Execute activity',
        description: 'User can execute an activity.'
    },
    MANAGE_COMMENTS: {
        id: 'MANAGE_COMMENTS',
        name: 'Manage comments',
        description: `Manage other user's comments.`
    },
}

export const permissionsList: ReadonlyArray<Permission> = objectKeys(permissionsById)
    .reduce<Permission[]>((acc, key) => {
        const permission = getPermissionById(key);
        acc.push(permission);
        return acc;
    }, []);

export function getPermissionById(id: PermissionId): Permission {
    return permissionsById[id];
}

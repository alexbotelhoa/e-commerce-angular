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
    MANAGE_CLASS: {
        id: 'MANAGE_CLASS',
        name: 'Manage class',
        description: `Manage classes`
    },
    MANAGE_CHALLENGE: {
        id: 'MANAGE_CHALLENGE',
        name: 'Manage challenge',
        description: `Manage challenges`
    },
    MANAGE_NEWSLETTER: {
        id: 'MANAGE_NEWSLETTER',
        name: 'Manage newsletter',
        description: `Manage newsletter`
    },
    HORIZON_ONE: {
        id: 'HORIZON_ONE',
        name: 'Horizon One',
        description: `Horizon One`
    },
    CHAT_ETUTOR: {
        id: 'CHAT_ETUTOR',
        name: 'Chat E-Tutor',
        description: 'Manage chat'
    },
    COURSES_ETUTOR: {
        id: 'COURSES_ETUTOR',
        name: 'Courses E-Tutor',
        description: 'Manage courses'
    },
    MY_QUESTIONS: {
        id: 'MY_QUESTIONS',
        name: 'My questions E-Tutor',
        description: 'Manage questions'
    }
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

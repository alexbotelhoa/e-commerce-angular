import { Role } from "../types/role.type";
import { RoleId } from "../enums/role-id.enum";
import { objectKeys } from "../../../shared/utils/typed-object-keys.util";

export const masterRole: Role = {
    id: RoleId.MASTER,
    name: 'Master',
    permissionMap: {
        MANAGE_MASTER: true,
    }
}
export const adminRole: Role = {
    id: RoleId.ADMIN,
    name: 'Administrator',
    permissionMap: {
        MANAGE_ACTIVITY: true,
        MANAGE_CYCLE: true,
        MANAGE_LEVEL: true,
        MANAGE_THEME: true,
        MANAGE_COMMENTS: true,
        MANAGE_CHALLENGE: true,
        MANAGE_NEWSLETTER: true,
    }
}

export const studentRole: Role = {
    id: RoleId.STUDENT,
    name: 'Student',
    permissionMap: {
        EXECUTE_ACTIVITY: true,
        HORIZON_ONE: true,
    }
}

export const horizonOneRole: Role = {
    id: RoleId.HORIZON_ONE,
    name: 'Horizon One',
    permissionMap: {
        EXECUTE_ACTIVITY: true,
        HORIZON_ONE: true,
    }
}

export const teacherRole: Role = {
    id: RoleId.TEACHER,
    name: 'Teacher',
    permissionMap: {
        MANAGE_COMMENTS: true,
        MANAGE_CLASS: true,
    }
}

export const eTutorRole: Role = {
    id: RoleId.E_TUTOR,
    name: 'E-Tutor',
    permissionMap: {
        MY_QUESTIONS: true,
        CHAT_ETUTOR: true,
        COURSES_ETUTOR: true,
    }
}

export const guardianRole: Role = {
    id: RoleId.GUARDIAN,
    name: 'Guardian',
    permissionMap: {
    }
}

export const rolesById: Readonly<Record<RoleId, Role>> = {
    [RoleId.MASTER]: masterRole,
    [RoleId.ADMIN]: adminRole,
    [RoleId.STUDENT]: studentRole,
    [RoleId.TEACHER]: teacherRole,
    [RoleId.GUARDIAN]: guardianRole,
    [RoleId.HORIZON_ONE]: horizonOneRole,
    [RoleId.E_TUTOR]: eTutorRole
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

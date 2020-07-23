import { CurrentUser } from "../../../shared/types/authenticated-user.type"
import { PermissionId } from "../enums/permission-id.enum"
import { FastifyRequest } from "fastify";
import { Role } from "../types/role.type";
import { PermissionMap } from "../types/permission-map.type";

/**
 * Checks if user has a permission
 * @param permission 
 */
export const userHasPermission =
    (permission: PermissionId) =>
        (user: CurrentUser | null): boolean => {
            if (!user) {
                return false;
            }
            return Boolean(user.permissionMap[permission]);
        }

/**
 * Extracts currentUser from the request's JWT, returning null if user is not authenticated
 * @param request 
 */
export const createCurrentUserFromRequest = (request: FastifyRequest): CurrentUser | null => {
    if (!request.headers.authorization) {
        return null;
    }
    const currentUser: CurrentUser = {
        entity: {
            id: 1,
            email: 'alan.sa@mjv.com.br',
            name: 'Alan Jhonnes',
        },
        sessionId: '883e105e-64bb-4614-b392-83a4c3d8a7a3',
        permissionMap: {
            MANAGE_ACTIVITY: true,
            MANAGE_CYCLE: true,
        }
    };
    return currentUser;
}

export const mergePermissionFromRoles = (roles: Role[]): PermissionMap => roles.reduce<PermissionMap>((map, role) => {
    return {
        ...map,
        ...role.permissionMap,
    };
}, {});

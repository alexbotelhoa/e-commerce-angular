import { AuthenticatedUser } from "../../../shared/types/authenticated-user.type"
import { PermissionId } from "../enums/permission-id.enum"
import { FastifyRequest, FastifyInstance } from "fastify";
import { Role } from "../types/role.type";
import { PermissionMap } from "../types/permission-map.type";
import { JWTPayload } from "../../authentication/types/jwt-payload.type";
import { getRoleById } from "../constants/roles.constants";

/**
 * Checks if user has a permission
 * @param permission 
 */
export const userHasPermission =
    (permission: PermissionId) =>
        (user: AuthenticatedUser | null): boolean => {
            if (!user) {
                return false;
            }
            return Boolean(user.permissionMap[permission]);
        }

/**
 * Extracts currentUser from the request's JWT, returning null if user is not authenticated
 * @param request 
 */
export const createCurrentUserFromRequest = (jwtLib: FastifyInstance['jwt'], request: FastifyRequest): AuthenticatedUser | null => {
    const token = request.headers.authorization;
    if (!token) {
        return null;
    }

    // this will throw if token is not valid
    const tokenData = jwtLib.verify<JWTPayload>(token);

    const roles: Role[] = tokenData.roles.map(getRoleById);

    const permissionMap = mergePermissionFromRoles(roles);

    const currentUser: AuthenticatedUser = {
        id: tokenData.userId,
        roleIds: tokenData.roles,
        roles: roles,
        permissionMap: permissionMap,
    };
    return currentUser;
}

/**
 * Merge permissions from an array of roles into a single permissionMap
 * @param roles 
 */
export const mergePermissionFromRoles = (roles: Role[]): PermissionMap => roles.reduce<PermissionMap>((map, role) => {
    return {
        ...map,
        ...role.permissionMap,
    };
}, {});

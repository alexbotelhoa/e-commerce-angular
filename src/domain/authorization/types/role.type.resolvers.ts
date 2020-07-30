import { GQLRoleResolvers } from "../../../resolvers-types";
import { objectKeys } from "../../../shared/utils/typed-object-keys.util";
import { getPermissionById } from "../constants/permissions.constants";


export const roleResolvers: GQLRoleResolvers = {
    id: obj => obj.id,
    name: obj => obj.name,
    permissions: obj => objectKeys(obj.permissionMap).map(getPermissionById),
}

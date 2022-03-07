import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectUserRole } from "../../../shared/repositories/user-role.repository";

export const userRolesQueryResolver: GQLQueryResolvers['userRoles'] = async (obj, { data }, context) => {
    const query = selectUserRole(context.readonlyDatabase);
    if (data) {
        if (data.userId) {
            query.where('userId', data.userId.toString());
        }
        if (data.roleIds && data.roleIds.length > 0) {
            query.whereIn('roleId', data.roleIds);
        }
    }
    return await query;
}

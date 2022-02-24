import { GQLMutationResolvers, RoleId } from "../../../resolvers-types";
import { insertUserRole, deleteUserRole } from "../../../shared/repositories/user-role.repository";

export const updateUserRolesMutationResolver: GQLMutationResolvers['updateUserRoles'] = async (obj, { data }, context) => {

    const userId = data.userId;

    await deleteUserRole(context.database)(builder => builder.andWhere({ userId: `${userId}` }));

    await data.roleIds.map(role => {
        insertUserRole(context.database)({
            userId: userId.toString(),
            roleId: role as RoleId
        })
    });

    return true;
}

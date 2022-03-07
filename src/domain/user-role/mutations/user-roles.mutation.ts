import { GQLMutationResolvers, RoleId } from "../../../resolvers-types";
import { insertUserRole, deleteUserRole } from "../../../shared/repositories/user-role.repository";

export const updateUserRolesMutationResolver: GQLMutationResolvers['updateUserRoles'] = async (obj, { data }, context) => {

    const userId = data.userId;

    await context.database.transaction(async trx => {
        await deleteUserRole(trx)(builder => builder.andWhere({ userId: `${userId}` }));

        await data.roleIds.map(role => {
            insertUserRole(trx)({
                userId: userId.toString(),
                roleId: role as RoleId
            })
        });
    });

    return true;
}

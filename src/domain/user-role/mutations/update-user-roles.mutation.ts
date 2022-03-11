import { GQLMutationResolvers, RoleId } from "../../../resolvers-types";
import { insertUserRole, deleteUserRole, selectUserRole } from "../../../shared/repositories/user-role.repository";

export const updateUserRolesMutationResolver: GQLMutationResolvers['updateUserRoles'] = async (obj, { data }, context) => {
    const roles = [RoleId.MASTER, RoleId.ADMIN, RoleId.E_TUTOR];

    const isNewUser = data.isNewUser;
    const userId = data.userId;
    const roleIds = data.roleIds;
    const currentUser = context.currentUser;

    const isEditingLoggedUser = currentUser && currentUser?.id === userId;
    const isIncludingMaster = roleIds && roleIds.includes(RoleId.MASTER);

    if (roleIds && roleIds.length === 0) {
        throw new Error("Roles not found");
    }
    
    if (isNewUser) {
        const userRoles = await selectUserRole(context.readonlyDatabase).
                                    where('userId', '=', userId).
                                    whereIn('roleId', roles);
                                    
        if (userRoles && userRoles.length > 0) {
            throw new Error("User already exists");
        }
    } else {
        if (isEditingLoggedUser && !isIncludingMaster) {
            throw new Error("Can't remove role master");
        }
    }

    await context.database.transaction(async trx => {
        await deleteUserRole(trx)(builder => builder.
                                                andWhere({ userId: userId.toString() }).
                                                whereIn('roleId', roles));

        if (roleIds) {
            await roleIds.map((role: RoleId) => {
                insertUserRole(trx)({
                    userId: userId.toString(),
                    roleId: role as RoleId
                });
            });
        }

    });

    return true;
}

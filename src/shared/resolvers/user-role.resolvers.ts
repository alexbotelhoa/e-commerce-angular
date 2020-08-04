import { GQLUserRoleResolvers } from "../../resolvers-types";
import { UserRoleEntity } from "../../entities/user-role.entity";
import { getRoleById } from "../../domain/authorization/constants/roles.constants";
import { getUserById } from "../repositories/user.repository";

export const userRoleEntityResolvers: Pick<GQLUserRoleResolvers, keyof UserRoleEntity> = {
    id: obj => obj.id.toString(),
    roleId: obj => obj.roleId,
    userId: obj => obj.userId.toString(),
}



export const userRoleResolvers: GQLUserRoleResolvers = {
    ...userRoleEntityResolvers,
    role: (obj) => getRoleById(obj.roleId),
    user: async (obj, params, context) => (await getUserById(context.database)(obj.userId))!,
}

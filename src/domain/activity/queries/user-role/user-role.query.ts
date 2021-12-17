import { GQLQueryResolvers } from "../../../../resolvers-types";
import { getUserRoleById } from "../../../../shared/repositories/user-role.repository";

export const userRoleQueryResolver: GQLQueryResolvers['userRole'] = async (obj, params, context) => {
    return await getUserRoleById(context.database)(params.id);
}

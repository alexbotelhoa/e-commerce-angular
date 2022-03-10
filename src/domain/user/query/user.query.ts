import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectUser } from "../../../shared/repositories/user.repository";

export const userQueryResolver: GQLQueryResolvers['user'] = async (obj, { data }, context) => {
    let result = [];
    if (data) {
        const userId = data.userId;
        if (userId) {
            result = await selectUser(context.readonlyDatabase).where('id', '=', userId.toString());
        }
        const roleIds = data.roleIds;
        if (roleIds && roleIds.length > 0) {
            result = await context.database.
                    select('u.*').
                    from('user as u').
                    join('user_role as ur', 'ur.userId', 'u.id').
                    whereIn('ur.roleId', roleIds);
        }
    }
    return result;
}

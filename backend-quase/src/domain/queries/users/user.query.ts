import { GQLQueryResolvers } from "../../../resolvers-types";
import { getUserById } from "../../../shared/repositories/user.repository";

export const userQueryResolver: GQLQueryResolvers['users'] = async (obj, { id }, context) => {
    return await getUserById(context.database)(id);
}

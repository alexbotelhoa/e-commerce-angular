import { GQLQueryResolvers } from "../../../resolvers-types";
import { getUserById } from "../../../shared/repositories/user.repository";

export const currentUserQueryResolver: GQLQueryResolvers['currentUser'] = async (obj, params, context) => {
    // const user = context.currentUser;
    // if (!user) {
    //     return null;
    // }
    const userEntity = await getUserById(context.database)(1);
    // const userEntity = await getUserById(context.database)(user.id);
    return userEntity;
}

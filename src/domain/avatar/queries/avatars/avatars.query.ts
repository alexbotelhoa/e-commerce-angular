import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectAvatar } from "../../../../shared/repositories/avatar.repository";

export const avatarsQueryResolver: GQLQueryResolvers['avatars'] = async (obj, params, context) => {
    return await selectAvatar(context.database);
}

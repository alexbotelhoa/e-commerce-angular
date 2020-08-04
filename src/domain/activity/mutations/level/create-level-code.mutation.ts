import { GQLMutationResolvers } from "../../../../resolvers-types";

import { insertLevelCode, getLevelCodeById } from "../../../../shared/repositories/level-code.repository";

export const createLevelCodeMutation: GQLMutationResolvers['createLevelCode'] = async (obj, { data }, context) => {
    await insertLevelCode(context.database)({
        id: data.id,
        active: data.active,
    });
    return (await getLevelCodeById(context.database)(data.id))!
}

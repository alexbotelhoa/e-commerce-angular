import { GQLQueryResolvers } from "../../../../resolvers-types";
import { getLevelById } from "../../../../shared/repositories/level.repository";

export const levelQueryResolver: GQLQueryResolvers['level'] = (obj, { id }, context) => {
    return getLevelById(context.database)(id);
}
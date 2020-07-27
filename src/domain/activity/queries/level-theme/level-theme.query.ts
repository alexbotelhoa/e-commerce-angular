import { GQLQueryResolvers } from "../../../../resolvers-types";
import { getLevelThemeById } from "../../../../shared/repositories/level-theme.repository";

export const levelThemeQueryResolver: GQLQueryResolvers['levelTheme'] = (obj, { id }, context) => {
    return getLevelThemeById(context.database)(id);
}
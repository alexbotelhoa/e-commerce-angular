import { GQLQueryResolvers } from "../../../../resolvers-types";
import { getThemeById } from "../../../../shared/repositories/theme.repository";

export const themeQueryResolver: GQLQueryResolvers['theme'] = (obj, { id }, context) => {
    return getThemeById(context.database)(id);
}
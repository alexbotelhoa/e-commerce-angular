import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectThemeIcon } from "../../../../shared/repositories/theme-icon.repository";

export const themeIconsQueryResolver: GQLQueryResolvers['icons'] = (obj, params, context) => {
    return selectThemeIcon(context.database);
}
import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectLevelTheme } from "../../../../shared/repositories/level-theme.repository";

export const levelThemesQueryResolver: GQLQueryResolvers['levelThemes'] = (obj, params, context) => {
    return selectLevelTheme(context.database);
}
import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectLevelTheme } from "../../../../shared/repositories/level-theme.repository";

export const levelThemesQueryResolver: GQLQueryResolvers['levelThemes'] = (obj, { data }, context) => {
    return selectLevelTheme(context.database)
        .andWhere('levelId', data.levelId);
}

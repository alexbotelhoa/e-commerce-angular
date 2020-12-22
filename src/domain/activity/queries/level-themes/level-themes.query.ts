import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectLevelTheme } from "../../../../shared/repositories/level-theme.repository";

export const levelThemesQueryResolver: GQLQueryResolvers['levelThemes'] = (obj, { data }, context) => {
    const db = context.database;
    return selectLevelTheme(context.database)
        .andWhere('levelId', data.levelId);
}

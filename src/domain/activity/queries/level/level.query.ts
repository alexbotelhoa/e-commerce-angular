import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectTheme } from '../../../../shared/repositories/theme.repository';
import { getLevelById } from "../../../../shared/repositories/level.repository";
import { selectLevelTheme } from '../../../../shared/repositories/level-theme.repository'

export const levelQueryResolver: GQLQueryResolvers['level'] = (obj, { id }, context) => {
    return getLevelById(context.database)(id);
}

export const availableThemesResolver: GQLQueryResolvers['availableThemes'] = async (obj, { availableThemesInputData: { levelId } }, { database: db }) => {
    const levelThemes = await selectLevelTheme(db).where('levelId', levelId)
    return await selectTheme(db).whereNotIn('id', levelThemes.map(levelTheme => levelTheme.themeId)).andWhere('active', true);
}

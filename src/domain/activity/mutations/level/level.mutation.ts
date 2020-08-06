import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelById, updateLevel } from "../../../../shared/repositories/level.repository"
import { LEVEL_THEME_TABLE } from "../../../../entities/level-theme.entity"
import { getLevelThemeById, deleteLevelTheme } from "../../../../shared/repositories/level-theme.repository";

export const addThemesToLevelMutationResolver: GQLMutationResolvers['addThemesToLevel'] = async (obj, { data: { levelId, items } }, { database: db }) => {
    const bulkInsert = items.map(item => ({ ...item, levelId }))
    await db.insert(bulkInsert).into(LEVEL_THEME_TABLE)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getLevelById(db)(levelId))!
}

export const toggleLevelState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateLevel'] | GQLMutationResolvers['deactivateLevel'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            await updateLevel(db)(data)(builder => builder.andWhere('id', parseInt(id)))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getLevelById(db)(id))!;
        }

export const deleteThemeFromLevelMutation: GQLMutationResolvers['deleteThemeFromLevel'] = async (obj, data, context) => {
    const levelTheme = await getLevelThemeById(context.database)(data.levelThemeId);
    if (!levelTheme) {
        throw new Error(`LevelTheme not found with id ${data.levelThemeId}`);
    }
    await deleteLevelTheme(context.database)(builder => builder.andWhere('id', data.levelThemeId));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getLevelById(context.database)(levelTheme.levelId))!;
}

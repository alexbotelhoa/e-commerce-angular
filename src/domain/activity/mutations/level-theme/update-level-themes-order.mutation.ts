import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getLevelThemesByIds, updateLevelTheme } from "../../../../shared/repositories/level-theme.repository";

export const updateLevelThemesOrderMutation: GQLMutationResolvers['updateLevelThemesOrder'] = async (obj, { data }, context) => {
    const levelThemeIds = data.map(entity => entity.levelThemeId);
    const levelThemes = await getLevelThemesByIds(context.database)(levelThemeIds);
    if (levelThemes.length !== data.length) {
        throw new Error(`Unable to find all level themes with ids ${levelThemeIds}`)
    }
    // using standard for lets us make use of async/await to update them sequentially
    for (let index = 0; index < data.length; index++) {
        const cycleActivity = data[index];
        await updateLevelTheme(context.database)({
            id: parseInt(cycleActivity.levelThemeId, 10),
            order: cycleActivity.order,
        })(builder => builder.andWhere('id', cycleActivity.levelThemeId));
    }
    return await getLevelThemesByIds(context.database)(levelThemeIds).orderBy('order', 'asc');
}

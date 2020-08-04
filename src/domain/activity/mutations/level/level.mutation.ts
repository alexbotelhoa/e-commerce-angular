import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelById, updateLevel } from "../../../../shared/repositories/level.repository"
import { LEVEL_THEME_TABLE } from "../../../../entities/level-theme.entity"

export const addThemesToLevelMutationResolver: GQLMutationResolvers['addThemesToLevel'] = async (obj, { data: { levelId, items } }, { database: db }) => {
    const bulkInsert = items.map(item => ({ ...item, levelId }))
    await db.insert(bulkInsert).into(LEVEL_THEME_TABLE)
    return await getLevelById(db)(levelId)
}

export const toggleLevelState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateLevel'] | GQLMutationResolvers['deactivateLevel'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getLevelById(db)(await updateLevel(db)(data)(builder => builder.andWhere('id', id))))!;
        }

import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelById } from "../../../../shared/repositories/level.repository"
import { LEVEL_THEME_TABLE } from "../../../../entities/level-theme.entity"

export const addThemesToLevelMutationResolver: GQLMutationResolvers['addThemesToLevel'] = async (obj, { data: { levelId, items } }, { database: db }) => {
    const bulkInsert = items.map(item => ({ ...item, levelId }))
    await db.insert(bulkInsert).into(LEVEL_THEME_TABLE)
    return await getLevelById(db)(levelId)
}
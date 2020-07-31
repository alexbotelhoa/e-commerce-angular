import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelThemesByIds } from "../../../../shared/repositories/level-theme.repository"
import { LEVEL_THEME_TABLE } from "../../../../entities/level-theme.entity"
import { getOneOrFail } from "../../../../shared/utils/get-one-or-null.util"

export const addThemesToLevelMutationResolver: GQLMutationResolvers['addThemesToLevel'] = async (obj, { id, themeIds, orders }, { database: db }) => {
    const idList = [],
        themeListLength = themeIds.length

    if (orders && themeListLength != orders.length) {
        throw new Error('activityIds and orders must have the same length!')
    }

    for (let i = 0; i < themeListLength; ++i) {
        const themeId = themeIds[i],
            order = orders ? orders[i] : undefined

        idList.push(await db.insert({ levelId: id, themeId, order }).into(LEVEL_THEME_TABLE).then(getOneOrFail))
    }

    return await getLevelThemesByIds(db)(idList)
}
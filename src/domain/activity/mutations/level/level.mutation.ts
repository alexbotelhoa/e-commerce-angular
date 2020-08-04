import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelById, insertLevel, updateLevel } from "../../../../shared/repositories/level.repository"
import { LEVEL_THEME_TABLE } from "../../../../entities/level-theme.entity"
import { getOneOrNull } from "../../../../shared/utils/get-one-or-null.util"

export const addThemesToLevelMutationResolver: GQLMutationResolvers['addThemesToLevel'] = async (obj, { data: { levelId, items } }, { database: db }) => {
    const bulkInsert = items.map(item => ({ ...item, levelId }))
    await db.insert(bulkInsert).into(LEVEL_THEME_TABLE)
    return await getLevelById(db)(levelId)
}

export const createLevelMutationResolver: GQLMutationResolvers['createLevel'] = async (obj, { data: { name, order, active } }, context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getLevelById(context.database)(await insertLevel(context.database)({
        name,
        order: order || undefined,
        active: active || undefined
    })))!;
}

export const toggleLevelState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateLevel'] | GQLMutationResolvers['deactivateLevel'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            await updateLevel(db)(data)(builder => builder.andWhere('id', parseInt(id)))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getLevelById(db)(id))!;
        }
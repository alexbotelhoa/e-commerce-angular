import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelById, insertLevel } from "../../../../shared/repositories/level.repository"
import { updateLevelCode } from "../../../../shared/repositories/level-code.repository";

export const createLevelMutationResolver: GQLMutationResolvers['createLevel'] = async (obj, { data }, context) => {
    const insertedLevelId = await context.database.transaction(async (trx) => {
        const levelId = await insertLevel(trx)({
            name: data.name,
            active: data.active,
            description: data.description,
            order: data.order,
        });
        if (data.codes.length > 0) {
            await updateLevelCode(trx)({
                levelId: levelId,
            })(builder => builder.whereIn('id', data.codes));
        }
        return levelId;
    });

    return (await getLevelById(context.database)(insertedLevelId))!
}

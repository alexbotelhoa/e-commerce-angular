import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelById, updateLevel } from "../../../../shared/repositories/level.repository"
import { updateLevelCode } from "../../../../shared/repositories/level-code.repository";

export const updateBasicLevelInfoMutationResolver: GQLMutationResolvers['updateBasicLevelInfo'] = async (obj, { data }, context) => {
    const level = await getLevelById(context.database)(parseInt(data.id, 10));
    if (!level) {
        throw new Error(`Level with id ${data.id} not found.`);
    }
    await context.database.transaction(async (trx) => {
        await updateLevel(trx)({
            name: data.name,
            active: data.active,
            description: data.description,
            order: data.order,
        })(builder => builder.andWhere('id', data.id));
        await updateLevelCode(trx)({
            levelId: null,
        })(builder => builder.andWhere('levelId', data.id));
        if (data.codes.length > 0) {
            await updateLevelCode(trx)({
                levelId: parseInt(data.id, 10)
            })(builder => builder.whereIn('id', data.codes));
        }
    });
    return (await getLevelById(context.database)(data.id))!;
}

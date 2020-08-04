import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelById, updateLevel } from "../../../../shared/repositories/level.repository"
import { insertLevelLevelCode, deleteLevelLevelCode } from "../../../../shared/repositories/level-level-code.repository";
import { LevelLevelCodeEntity } from "../../../../entities/level-level-code.entity";

export const updateBasicLevelInfoMutationResolver: GQLMutationResolvers['updateBasicLevelInfo'] = async (obj, { data }, context) => {
    const level = await getLevelById(context.database)(parseInt(data.id, 10));
    if (!level) {
        throw new Error(`Level with id ${data.id} not found.`);
    }
    const levelLevelCodes: LevelLevelCodeEntity[] = data.codes.map<LevelLevelCodeEntity>(codeId => ({
        levelCodeId: codeId,
        levelId: parseInt(data.id, 10),
    }));
    await context.database.transaction(async (trx) => {
        await updateLevel(trx)({
            name: data.name,
            active: data.active,
            order: data.order,
        })(builder => builder.andWhere('id', data.id));
        await deleteLevelLevelCode(trx)(builder => builder.andWhere('levelId', data.id));
        await insertLevelLevelCode(trx)(levelLevelCodes);
    });
    return (await getLevelById(context.database)(data.id))!;
}

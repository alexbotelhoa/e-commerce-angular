import { GQLMutationResolvers } from "../../../../resolvers-types";

import { getLevelById, insertLevel } from "../../../../shared/repositories/level.repository"
import { insertLevelLevelCode } from "../../../../shared/repositories/level-level-code.repository";
import { LevelLevelCodeEntity } from "../../../../entities/level-level-code.entity";

export const createLevelMutationResolver: GQLMutationResolvers['createLevel'] = async (obj, { data }, context) => {
    const levelId = await insertLevel(context.database)({
        name: data.name,
        active: data.active,
        order: data.order,
    });
    const levelLevelCodes = data.codes.map<LevelLevelCodeEntity>(codeId => ({
        levelCodeId: codeId,
        levelId: levelId,
    }));
    await insertLevelLevelCode(context.database)(levelLevelCodes);
    return (await getLevelById(context.database)(levelId))!
}

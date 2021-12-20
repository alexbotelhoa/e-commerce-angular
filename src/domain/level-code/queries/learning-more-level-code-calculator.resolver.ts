import { GQLQueryResolvers } from "../../../resolvers-types";
import { LevelCodeEntity } from "../../../entities/level-code.entity";
import { selectLevelCode } from "../../../shared/repositories/level-code.repository";

export const getLearningMoreLevelCodeCalculatorResolver: GQLQueryResolvers['learningMoreOption'] = async (obj, params, context) => {
    if (params.filters.levelId) {
        const levelCodes = await selectLevelCode(context.readonlyDatabase).where("levelId", params.filters.levelId);
        return determinateLearningMorePriorityReduce(levelCodes);
    } else {
        const user = context.currentUser;
        const userId = user?.id;
        const [levelCodes]: LevelCodeEntity[][] = await context.readonlyDatabase.raw(`
            select
                lc.*
            from
                class,
                enrollment_class ec,
                enrollment e,
                user u,
                level_code lc
            where
                u.id = e.userId
                and e.id = ec.enrollmentId
                and ec.classId = class.id
                and lc.id = class.levelCodeId 
                and u.id = ${userId}
        `)
        return determinateLearningMorePriorityReduce(levelCodes)
    }
}

function determinateLearningMorePriorityReduce(levelCode: LevelCodeEntity[]): LevelCodeEntity {
    const result = levelCode.reduce((acc, item) => {
        if (item.learningMore) {
            acc[item.learningMore]  = item;
        }
        return acc;
    }, {kanttum: null, paginab2c: null, eyoung: null, spboost: null, podcast: null} as any);
    return result.kanttum || result.spboost || result.podcast || result.eyoung || result.paginab2c || null;
}

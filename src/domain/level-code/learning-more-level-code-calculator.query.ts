import { GQLQueryResolvers } from "../../resolvers-types";
import { LevelCodeEntity } from "../../entities/level-code.entity";
import { selectLevelCode } from "../../shared/repositories/level-code.repository";

export const getLearningMoreLevelCodeCalculatorResolver: GQLQueryResolvers['learningMoreOption'] = async (obj, params, context) => {
    const isTeacher = context.currentUser?.roleIds.some(teacher => teacher === 2);

    if (params.filters.levelId) {
        const levelCodes = await selectLevelCode(context.readonlyDatabase).where("levelId", params.filters.levelId);
        return determinateLearningMorePriorityReduce(levelCodes, isTeacher);
    } else {
        const user = context.currentUser;
        const userId = user?.id;
        const [levelCodes]: LevelCodeEntity[][] = await context.readonlyDatabase.raw(`
            SELECT
                lc.*
            FROM
                class,
                enrollment_class ec,
                enrollment e,
                user u,
                level_code lc
            WHERE
                u.id = e.userId
                AND e.id = ec.enrollmentId
                AND ec.classId = class.id
                AND lc.id = class.levelCodeId 
                AND u.id = ${userId}
        `);
        return determinateLearningMorePriorityReduce(levelCodes, isTeacher);
    }
}

function determinateLearningMorePriorityReduce(levelCode: LevelCodeEntity[], isTeacher?: boolean): LevelCodeEntity {
    const result = levelCode.reduce((acc, item) => {
        if (item.learningMore) {
            acc[item.learningMore] = item;
        }
        return acc;
    }, { kanttum: null, spboost: null, podcast: null, eyoung: null, paginab2c: null } as any);

    if (isTeacher) {
        return result.kanttum || result.spboost || result.podcast || result.eyoung || result.paginab2c || null;
    }
    return result.spboost || result.podcast || result.eyoung || result.paginab2c || null;
}

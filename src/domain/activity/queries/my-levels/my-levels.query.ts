import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectEnrollment } from "../../../../shared/repositories/enrollment.repository";
import { selectLevel } from "../../../../shared/repositories/level.repository";
import { selectLevelCode } from "../../../../shared/repositories/level-code.repository";
import { LEVEL_TABLE } from "../../../../entities/level.entity";
import { LEVEL_CODE_TABLE } from "../../../../entities/level-code.entity";
import { ENROLLMENT_TABLE } from "../../../../entities/enrollment.entity";

export const myLevelQueryResolver: GQLQueryResolvers['myLevels'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return [];
    }
    return await context.database
        .distinct(`${LEVEL_TABLE}.*`)
        .from(LEVEL_TABLE)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
        .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        .andWhere(`${ENROLLMENT_TABLE}.userId`, user.id)
        .andWhere(`${LEVEL_TABLE}.active`, true)
        .andWhere(`${LEVEL_CODE_TABLE}.active`, true);
    // const enrollments = await selectEnrollment(context.database).andWhere('userId', user.id);
    // const levelCodeIds = enrollments.map(enrollment => enrollment.levelCodeId);
    // const levelCodes = await selectLevelCode(context.database).whereIn('levelId', levelCodeIds);

    // return await select

}

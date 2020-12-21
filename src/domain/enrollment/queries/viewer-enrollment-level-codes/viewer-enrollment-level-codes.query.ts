import { GQLQueryResolvers } from "../../../../resolvers-types";
import { ENROLLMENT_TABLE } from "../../../../entities/enrollment.entity";
import { LEVEL_CODE_TABLE } from "../../../../entities/level-code.entity";

export const viewerEnrollmentLevelCodesQueryResolver: GQLQueryResolvers['viewerEnrollmentLevelCodes'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return [];
    }

    const query = context.database
        .distinct(`${LEVEL_CODE_TABLE}.*`)
        .from(LEVEL_CODE_TABLE)
        .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        .andWhere('userId', params.filters?.userId);

    const entities = await query;
    return entities;
}
